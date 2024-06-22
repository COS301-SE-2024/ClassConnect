/** @type {import('./$types').Actions} */
import axios from 'axios';
import { webcrypto as crypto } from 'crypto';
import { FILE_UPLOAD_API_KEY, FILE_UPLOAD_URL } from '$env/static/private';

function generateFileName(originalFileName) {
	// Split the original filename to get the base name and extension
	const lastDotIndex = originalFileName.lastIndexOf('.');
	if (lastDotIndex === -1) {
		throw new Error('Filename does not have an extension');
	}

	const extension = originalFileName.substring(lastDotIndex);

	// 4-byte timestamp
	const timestamp = Math.floor(Date.now() / 1000);
	const timestampHex = timestamp.toString(16).padStart(8, '0');

	// 5-byte random value
	const randomValue = crypto.getRandomValues(new Uint8Array(5));
	const randomValueHex = Array.from(randomValue)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	// 3-byte counter, initialized to a random value
	const counter = Math.floor(Math.random() * 0xffffff);
	const counterHex = counter.toString(16).padStart(6, '0');

	// Combine to form the ObjectId
	const objectId = timestampHex + randomValueHex + counterHex;

	// Combine objectId and extension to form the final filename
	return `${objectId}${extension}`;
}

async function fileToBase64(file) {
	const buffer = await file.arrayBuffer();
	const base64 = Buffer.from(buffer).toString('base64');
	return base64;
}

async function uploadFileToS3(file, filename, contentType) {
	try {
		const base64file = await fileToBase64(file);

		const body = {
			file: base64file,
			filename: filename,
			contentType: contentType
		};

		const headers = {
			'Content-Type': 'application/json',
			'x-api-key': FILE_UPLOAD_API_KEY
		};

		const response = await axios.post(FILE_UPLOAD_URL, body, { headers });

		// Parse the response body JSON
		const responseBody = JSON.parse(response.data.body);

		// Check if response includes fileUrl
		if (responseBody.fileUrl) {
			console.log('File uploaded successfully');
			return responseBody; // Return the entire response body if needed
		} else {
			console.log(responseBody);
			throw new Error('File upload failed: No fileUrl in response');
		}
	} catch (error) {
		console.log('Error during file upload:', error);
		throw error;
	}
}

async function sendToDatabase(type, workspace_id, lecturer_id, title, description, file_path) {
	console.log(type);
	console.log(workspace_id);
	console.log(lecturer_id);
	console.log(title);
	console.log(description);
	console.log(file_path);
	//TODO : just make the api call
}

export const actions = {
	upload: async ({ request }) => {
		try {
			const formData = await request.formData();

			// Get the form field values
			const title = formData.get('title');
			const description = formData.get('description');
			const workspace_id = formData.get('workspace');
			const lecturer_id = formData.get('userId');
			let file_url;
			const file = formData.get('file');

			// Log the extracted data
			console.log('Title:', title);
			console.log('Description:', description);

			// Ensure the file is present
			if (!file) {
				throw new Error('File is required');
			}

			if (file instanceof File) {
				const filename = generateFileName(file.name);
				const response_data = await uploadFileToS3(file, filename, file.type);
				file_url = response_data.fileUrl;
				console.log('File URL:', file_url);
				if (file.type === 'application/pdf') {
					sendToDatabase(true, workspace_id, lecturer_id, title, description, file_url);
				} else {
					sendToDatabase(false, workspace_id, lecturer_id, title, description, file_url);
				}
			} else {
				console.log('No file received');
			}
		} catch (error) {
			console.error('Error during file upload:', error);
			return {
				error: {
					message: error.message,
					stack: error.stack
				}
			};
		}
	},

	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			// TODO: create the delete logic
			return formData;
		} catch (error) {
			console.error('Error during file deletion:', error);
			return {
				error: {
					message: error.message,
					stack: error.stack
				}
			};
		}
	}
};
