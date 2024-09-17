// src/routes/api/upload/+server.ts
import { json } from '@sveltejs/kit';
import { determineFolderFromName } from '$lib/server/storage';
import { updateConfig } from '$lib/server/aws.config';
import AWS from 'aws-sdk';
import { BUCKET } from '$env/static/private';

const S3 = new AWS.S3();

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	if (!BUCKET) {
		return json({ error: 'No bucket name specified' }, { status: 500 });
	}

	const { action, filename, contentType, partNumber, uploadId, parts } = await request.json();
	const folder = determineFolderFromName(filename);
	const s3Key = `${folder}/${filename}`;

	updateConfig();

	try {
		switch (action) {
			case 'start': {
				const multipartUpload = await S3.createMultipartUpload({
					Bucket: BUCKET,
					Key: s3Key,
					ContentType: contentType,
					ContentDisposition: `inline; filename="${filename}"`
				}).promise();

				return json({ uploadId: multipartUpload.UploadId });
			}

			case 'getSignedUrl': {
				const signedUrl = await S3.getSignedUrlPromise('uploadPart', {
					Bucket: BUCKET,
					Key: s3Key,
					PartNumber: partNumber,
					UploadId: uploadId,
					Expires: 3600 // 1 hour
				});

				return json({ signedUrl });
			}

			case 'complete': {
				await S3.completeMultipartUpload({
					Bucket: BUCKET,
					Key: s3Key,
					MultipartUpload: { Parts: parts },
					UploadId: uploadId
				}).promise();

				const fileUrl = `https://${BUCKET}.s3.amazonaws.com/${s3Key}`;
				return json({ fileUrl });
			}

			default:
				return json({ error: 'Invalid action' }, { status: 400 });
		}
	} catch (error) {
		console.error('Error during upload:', error);
		return json({ error: 'Error processing upload' }, { status: 500 });
	}
}
