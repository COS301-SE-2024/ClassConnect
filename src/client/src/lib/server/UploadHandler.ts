import { upload, determineFolder } from '$lib/server/s3Bucket';
import type { UploadData } from '$src/types';
import Material from '$db/schemas/Material';
import Workspace from '$db/schemas/Workspace';

export async function uploadFile(fileData: UploadData) {
	const file = fileData.file;
	const folder = determineFolder(file);
	if (folder === 'study-material') {
		return materialUpload(fileData);
	} else if (folder === 'objects') {
		return objectUpload(fileData);
	} else {
		throw new Error('file not suported');
	}
}

async function objectUpload(fileData: UploadData) {
	try {
		console.log(fileData);
		generateObjectThumbnail(fileData.file);
	} catch (e) {
		console.error(e);
		throw new Error('Error uploading object');
	}
}

async function materialUpload(fileData: UploadData) {
	const file_path = await upload(fileData.file);
	const thumbnail_path = await upload(fileData.thumbnail);

	const workspace = await Workspace.findById(fileData.workspace);

	if (!workspace) {
		throw new Error('Workspace not found');
	}

	const newMaterial = new Material({
		title: fileData.title,
		description: fileData.description,
		file_path,
		thumbnail: thumbnail_path,
		type: false,
		workspace_id: workspace._id
	});

	await newMaterial.save();
	return newMaterial;
}

async function generateObjectThumbnail(object: File): Promise<File> {
	console.log('Generating thumbnail for object');
	console.log(object);
	return object;
}
