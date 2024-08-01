import AWS from 'aws-sdk';
import { BUCKET } from '$env/static/private';

const S3 = new AWS.S3();

export async function upload(file: File): Promise<string> {
	try {
		if (!BUCKET) {
			throw new Error('No bucket name');
		}

		console.log('File size: ', file.size);
		console.log('File name: ', file.name);

		const key: string = generateFileName(file.name);
		const fileSize = 7 * 1024 * 1024; // 7MB in bytes
		const folder: string = determineFolder(file);

		if (file.size < fileSize) {
			return smallFile(file, key, folder, file.type);
		} else {
			return bigFile(file, key, folder, file.type);
		}
	} catch (error) {
		throw new Error('Error uploading file');
	}
}

export async function deleteFile(url: string): Promise<void> {
	const urlObj = new URL(url);
	const key = urlObj.pathname.slice(1);

	const params = {
		Bucket: BUCKET,
		Key: key
	};

	// Check if the key contains the word 'default'
	const defaultRegex = /default/;
	if (defaultRegex.test(key)) {
		console.log(`File could not be deleted as it is a default file: ${key}`);
		return;
	}

	try {
		await S3.deleteObject(params).promise();
		console.log(`Successfully deleted ${key} from ${BUCKET}`);
	} catch (error) {
		console.error(`Failed to delete ${key} from ${BUCKET}`, error);
		throw new Error('Error deleting file');
	}
}

async function smallFile(
	file: File,
	filename: string,
	folder: string,
	contentType: string
): Promise<string> {
	console.log('File name for s3: ', filename);

	if (!file || !(file instanceof Blob)) {
		throw new Error('No file uploaded');
	}

	const BUCKET_NAME: string = BUCKET;
	const s3Key: string = `${folder}/${filename}`;
	const contentDisposition = `inline; filename="${filename}"`;
	const arrayBuffer = await file.arrayBuffer();
	const fileContent = Buffer.from(arrayBuffer);

	// Upload the small file to S3
	const params = {
		Bucket: BUCKET_NAME,
		Key: s3Key,
		Body: fileContent,
		ContentType: contentType,
		ContentDisposition: contentDisposition
	};

	await S3.putObject(params).promise();

	const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

	return fileUrl;
}

export async function uploadThumbnail(fileContent: Buffer): Promise<string> {
	const filename: string = generateFileName(Date.now.toString() + ' thumbnail.png');
	const folder: string = 'pictures';
	const contentType: string = 'image/png';

	const BUCKET_NAME: string = BUCKET;
	const s3Key: string = `${folder}/${filename}`;
	const contentDisposition = `inline; filename="${filename}"`;

	// Upload the small file to S3
	const params = {
		Bucket: BUCKET_NAME,
		Key: s3Key,
		Body: fileContent,
		ContentType: contentType,
		ContentDisposition: contentDisposition
	};

	await S3.putObject(params).promise();

	const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

	return fileUrl;
}

async function bigFile(
	file: File,
	filename: string,
	folder: string,
	contentType: string
): Promise<string> {
	const BUCKET_NAME: string = BUCKET;
	const s3Key: string = `${folder}/${filename}`;
	const partSize = 5 * 1024 * 1024; // 5MB in bytes
	const maxUploadTries = 3;

	// 1. Create a multipart upload
	const createMultipartParams = {
		Bucket: BUCKET_NAME,
		Key: s3Key,
		ContentType: contentType,
		ContentDisposition: `inline; filename="${filename}"`
	};

	const multipartCreateResponse = await S3.createMultipartUpload(createMultipartParams).promise();
	const uploadId = multipartCreateResponse.UploadId;

	if (!uploadId) {
		throw new Error('Failed to create multipart upload');
	}

	// 2. Upload each part
	const promises = [];
	const numberOfParts = Math.ceil(file.size / partSize);
	for (let partNumber = 0; partNumber < numberOfParts; partNumber++) {
		const start = partNumber * partSize;
		const end = Math.min(start + partSize, file.size);
		const arrayBuffer = await file.slice(start, end).arrayBuffer();
		const fileContent = Buffer.from(arrayBuffer);
		const partParams = {
			Body: fileContent,
			Bucket: BUCKET_NAME,
			Key: s3Key,
			PartNumber: partNumber + 1,
			UploadId: uploadId
		};

		promises.push(uploadPartWithRetry(partParams, maxUploadTries));
	}

	const uploadResults = await Promise.all(promises);
	const parts = uploadResults.map((result, index) => ({
		ETag: result.ETag,
		PartNumber: index + 1
	}));

	// 3. Complete the multipart upload
	const completeMultipartParams = {
		Bucket: BUCKET_NAME,
		Key: s3Key,
		MultipartUpload: {
			Parts: parts
		},
		UploadId: uploadId
	};

	await S3.completeMultipartUpload(completeMultipartParams).promise();

	const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

	return fileUrl;
}

async function uploadPartWithRetry(partParams: any, maxTries: number): Promise<any> {
	let tries = 0;
	while (tries < maxTries) {
		try {
			return await S3.uploadPart(partParams).promise();
		} catch (error) {
			if (tries < maxTries - 1) {
				tries++;
				console.warn(`Retrying part upload (${tries + 1}/${maxTries})...`);
			} else {
				throw new Error('Failed to upload part after multiple attempts');
			}
		}
	}
}

function generateFileName(originalFileName: string): string {
	const lastDotIndex = originalFileName.lastIndexOf('.');
	if (lastDotIndex === -1) {
		throw new Error('Filename does not have an extension');
	}

	const extension = originalFileName.substring(lastDotIndex);
	const timestamp = Math.floor(Date.now() / 1000);
	const timestampHex = timestamp.toString(16).padStart(8, '0');
	const randomValue = crypto.getRandomValues(new Uint8Array(5));
	const randomValueHex = Array.from(randomValue)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	const counter = Math.floor(Math.random() * 0xffffff);
	const counterHex = counter.toString(16).padStart(6, '0');
	const objectId = timestampHex + randomValueHex + counterHex;

	return `${objectId}${extension}`;
}

export function determineFolder(file: File): string {
	const extension = file.name.split('.').pop()?.toLowerCase();

	if (!extension) {
		throw new Error('File has no extension');
	}

	const picturesExtensions = ['png', 'jpeg', 'jpg', 'webp'];
	const objectsExtensions = ['gltf', 'glb'];
	const studyMaterialExtensions = ['pdf', 'pptx', 'epub'];

	if (picturesExtensions.includes(extension)) {
		return 'pictures';
	} else if (objectsExtensions.includes(extension)) {
		return 'objects';
	} else if (studyMaterialExtensions.includes(extension)) {
		return 'study-material';
	} else {
		throw new Error('Unsupported file format');
	}
}
