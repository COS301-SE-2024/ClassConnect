import { upload, determineFolder } from '$lib/server/storage';
import { THUMBNAIL_API_KEY, THUMBNAIL_URL } from '$env/static/private';
import type { UploadData, UploadInfo } from '$src/types';
import Material from '$db/schemas/Material';
import Workspace from '$db/schemas/Workspace';
import axios from 'axios';

export async function uploadFile(fileData: UploadData) {
	const file = fileData.file;
	const folder = determineFolder(file);
	if (folder === 'study-material') {
		return materialUpload(fileData, false);
	} else if (folder === 'objects') {
		return materialUpload(fileData, true);
	} else if (folder === 'pictures') {
		const file_path = await upload(fileData.file);

		const workspace = await Workspace.findById(fileData.workspace);

		if (!workspace) {
			throw new Error('Workspace not found');
		}

		const newMaterial = new Material({
			title: fileData.title,
			description: fileData.description,
			file_path: file_path,
			thumbnail: file_path,
			type: false,
			workspace_id: workspace._id
		});

		await newMaterial.save();

		return newMaterial;
	} else {
		throw new Error('file not supported');
	}
}

export async function multipartUploadFile(fileData: UploadInfo, folder: string) {
	if (folder === 'study-material') {
		return materialUploadFromLink(fileData, false);
	} else if (folder === 'objects') {
		return materialUploadFromLink(fileData, true);
	} else if (folder === 'pictures') {
		const workspace = await Workspace.findById(fileData.workspace);

		if (!workspace) {
			throw new Error('Workspace not found');
		}

		const newMaterial = new Material({
			title: fileData.title,
			description: fileData.description,
			file_path: fileData.link,
			thumbnail: fileData.link,
			type: false,
			workspace_id: workspace._id
		});

		await newMaterial.save();

		return newMaterial;
	} else {
		throw new Error('file not supported');
	}
}

export async function materialUpload(fileData: UploadData, file_type: boolean) {
	const file_path = await upload(fileData.file);

	let thumbnail_path =
		'https://class-connect-file-storage.s3.amazonaws.com/pictures/default-file.svg';

	const body = {
		url: file_path,
		height: 300,
		width: 250
	};

	const headers = {
		'Content-Type': 'application/json',
		'x-api-key': THUMBNAIL_API_KEY
	};

	const response = await axios.post(THUMBNAIL_URL, body, { headers });

	// Parse the response body JSON
	const responseBody = JSON.parse(response.data.body);

	// Get the thumbnail URL from the response body
	if (responseBody.thumbnail_url) {
		thumbnail_path = responseBody.thumbnail_url;
	}

	const workspace = await Workspace.findById(fileData.workspace);

	if (!workspace) {
		throw new Error('Workspace not found');
	}

	const newMaterial = new Material({
		title: fileData.title,
		description: fileData.description,
		file_path,
		thumbnail: thumbnail_path,
		type: file_type,
		workspace_id: workspace._id
	});

	await newMaterial.save();
	return newMaterial;
}

export async function materialUploadFromLink(fileData: UploadInfo, file_type: boolean) {
	const file_path = fileData.link;

	let thumbnail_path =
		'https://class-connect-file-storage.s3.amazonaws.com/pictures/default-file.svg';

	const body = {
		url: file_path,
		height: 300,
		width: 250
	};

	const headers = {
		'Content-Type': 'application/json',
		'x-api-key': THUMBNAIL_API_KEY
	};

	const response = await axios.post(THUMBNAIL_URL, body, { headers });

	// Parse the response body JSON
	const responseBody = JSON.parse(response.data.body);

	// Get the thumbnail URL from the response body
	if (responseBody.thumbnail_url) {
		thumbnail_path = responseBody.thumbnail_url;
	}

	const workspace = await Workspace.findById(fileData.workspace);

	if (!workspace) {
		throw new Error('Workspace not found');
	}

	const newMaterial = new Material({
		title: fileData.title,
		description: fileData.description,
		file_path,
		thumbnail: thumbnail_path,
		type: file_type,
		workspace_id: workspace._id
	});

	await newMaterial.save();
	return newMaterial;
}
