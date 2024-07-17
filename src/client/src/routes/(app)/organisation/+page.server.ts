import type { Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import { upload, deleteFile } from '$lib/server/s3Bucket';

import User from '$db/schemas/User';
import type { ObjectId } from 'mongoose';
import Organisation from '$db/schemas/Organisation';

function formatOrganisation(org: any) {
	return {
		id: org._id.toString(),
		name: org.name,
		image: org.image
	};
}

async function getOrganisation(userId: ObjectId) {
	const organisation = await Organisation.findOne({ createdBy: userId });
	return organisation ? formatOrganisation(organisation) : null;
}

export async function load({ locals }) {
	if (locals.user?.role !== 'admin') throw error(401, 'Only admins can access this page');

	try {
		return await getOrganisation(locals.user.id);
	} catch (e) {
		console.error('Failed to load organisation:', e);
		throw error(500, 'Error occurred while fetching organisation');
	}
}

async function createOrganisation(data: FormData, userId: ObjectId) {
	const name = data.get('name') as string;
	let image: string = 'images/organisation-placeholder.png';
	const image_file: File = data.get('file') as File;

	if (!name) return fail(400, { error: 'Organisation Name is required' });

	if (image_file) {
		image = await upload(image_file);
	}

	const existingOrg = await Organisation.findOne({ createdBy: userId });
	if (existingOrg) return fail(400, { error: 'User already has an organisation' });

	const newOrganisation = new Organisation({
		name,
		createdBy: userId,
		image: image
	});

	await newOrganisation.save();
	await User.findByIdAndUpdate(userId, { organisation: newOrganisation._id });

	return { success: true };
}

async function editOrganisation(data: FormData, userId: ObjectId) {
	const id = data.get('id') as string;
	const name = data.get('name') as string;
	const image_file: File = data.get('file') as File;

	const Org = await Organisation.findById(id);
	let image: string;

	if (!id) return fail(400, { error: 'Organisation ID is required' });

	const updateData: { name?: string; image?: string } = {};

	if (name) updateData.name = name;

	if (image_file && Org) {
		image = await upload(image_file);
		if (image) {
			await deleteFile(Org.image);
			updateData.image = image;
		}
	}

	const updatedOrg = await Organisation.findOneAndUpdate(
		{ _id: id, createdBy: userId },
		updateData,
		{ new: true }
	);

	if (!updatedOrg) return fail(404, { error: 'Organisation not found or not authorized' });

	return { success: true };
}

async function deleteOrganisation(data: FormData, userId: ObjectId) {
	const id = data.get('id') as string;

	if (!id) return fail(400, { error: 'Organisation ID is required' });

	const deletedOrg = await Organisation.findOneAndDelete({ _id: id, createdBy: userId });
	if (deletedOrg) {
		const image_url: string = deletedOrg.image;
		if (image_url !== 'images/organisation-placeholder.png') {
			await deleteFile(image_url);
		}
	}
	if (!deletedOrg) return fail(404, { error: 'Organisation not found or not authorised' });

	await User.updateOne({ _id: userId }, { $unset: { organisation: '' } });
	await User.deleteMany({ organisation: id });

	return { success: true };
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		try {
			const data = await request.formData();

			return await createOrganisation(data, locals.user.id);
		} catch (e) {
			console.error('Error creating organisation:', e);
			return fail(500, { error: 'Failed to create organisation' });
		}
	},
	edit: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		try {
			const data = await request.formData();

			return await editOrganisation(data, locals.user.id);
		} catch (e) {
			console.error('Error updating organisation:', e);
			return fail(500, { error: 'Failed to update organisation' });
		}
	},
	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		try {
			const data = await request.formData();

			return await deleteOrganisation(data, locals.user.id);
		} catch (e) {
			console.error('Error removing organisation:', e);
			return fail(500, { error: 'Failed to remove organisation' });
		}
	}
};
