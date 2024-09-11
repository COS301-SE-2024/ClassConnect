import type { FileUploadReturn, User } from '$src/types';
import axios from 'axios';

/**
 * Uploads a file to the server in multiple parts.
 *
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<FileUploadReturn>} - The URL of the uploaded file and the name in a json object.
 * @throws Will throw an error if the upload fails at any step.
 */
export async function multipartUploadFile(file: File): Promise<FileUploadReturn> {
	const chunkSize = 5 * 1024 * 1024; // 5MB chunks
	const chunks = Math.ceil(file.size / chunkSize);
	const name = generateFileName(file.name);

	// Start the multipart upload
	const startResponse = await fetch('/api/upload', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			action: 'start',
			filename: name,
			contentType: file.type
		})
	});

	if (!startResponse.ok) {
		throw new Error('Failed to start');
	}

	const { uploadId } = await startResponse.json();
	const parts = [];

	for (let i = 0; i < chunks; i++) {
		const start = i * chunkSize;
		const end = Math.min(start + chunkSize, file.size);
		const chunk = file.slice(start, end);

		// Get a signed URL for this part
		const urlResponse = await fetch('/api/upload', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				action: 'getSignedUrl',
				filename: name,
				partNumber: i + 1,
				uploadId
			})
		});

		if (!urlResponse.ok) {
			throw new Error('Failed to get signed URL');
		}

		const { signedUrl } = await urlResponse.json();

		// Upload the part using the signed URL (directly to S3)
		const uploadResponse = await fetch(signedUrl, {
			method: 'PUT',
			body: chunk
		});

		if (!uploadResponse.ok) {
			throw new Error(`Failed to upload part ${i + 1}`);
		}

		parts.push({
			PartNumber: i + 1,
			ETag: uploadResponse.headers.get('ETag')
		});
	}

	// Complete the multipart upload
	const completeResponse = await fetch('/api/upload', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			action: 'complete',
			filename: name,
			uploadId,
			parts
		})
	});

	if (!completeResponse.ok) {
		throw new Error('Failed to complete upload');
	}

	const { fileUrl } = await completeResponse.json();

	if (fileUrl) {
		const data: FileUploadReturn = {
			name: name,
			url: fileUrl
		};
		return data;
	} else {
		throw new Error('Error getting the file URL');
	}
}

/**
 * Generates a unique file name based on the original file name.
 *
 * @param {string} originalFileName - The original file name.
 * @returns {string} - The generated unique file name.
 * @throws Will throw an error if the original file name does not have an extension.
 */
export function generateFileName(originalFileName: string): string {
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

/**
 * Fetches user data from the server.
 *
 * @returns {Promise<User>} - A promise that resolves to the user data.
 * @throws Will throw an error if the request fails.
 */
export async function getUserData(): Promise<User> {
	try {
		// # Fetch user data from the API
		const response = await axios.get('/api/user');

		// # Extract user data from the response
		const user = response.data;

		// # Construct the User object
		const data: User = {
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
			surname: user.surname,
			username: user.username
		};

		// # Return the constructed User object
		return data;
	} catch (error) {
		// ! Throw an error if the request fails
		throw new Error('Error getting user data');
	}
}
