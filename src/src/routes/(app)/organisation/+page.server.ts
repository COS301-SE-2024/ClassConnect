import { fail, error } from '@sveltejs/kit';
import { upload, deleteFile } from '$lib/server/storage';

import type { Actions } from './$types';
import type { ObjectId } from 'mongoose';

import User from '$db/schemas/User';
import Organisation from '$db/schemas/Organisation';

function formatOrganisation(org: any) {
	return {
		name: org.name,
		image: org.image,
		id: org._id.toString(),
		createdAt: org.createdAt.toDateString()
	};
}

async function getOrganisation(userId: ObjectId) {
	const organisation = await Organisation.findOne({ createdBy: userId });
	return organisation ? formatOrganisation(organisation) : null;
}

export async function load({ locals }) {
	if (locals.user?.role !== 'admin') throw error(401, 'Only admins can access this page');

	try {
		const organisation = await getOrganisation(locals.user.id);

		const numAdmins = await User.countDocuments({
			role: 'admin',
			organisation: locals.user.organisation
		});

		const numLecturers = await User.countDocuments({
			role: 'lecturer',
			organisation: locals.user.organisation
		});

		const numStudents = await User.countDocuments({
			role: 'student',
			organisation: locals.user.organisation
		});

		return {
			stats: {
				numAdmins,
				numStudents,
				numLecturers
			},
			id: organisation?.id,
			name: organisation?.name,
			image: organisation?.image,
			created: organisation?.createdAt
		};
	} catch (e) {
		console.error('Failed to load organisation:', e);
		throw error(500, 'Error occurred while fetching organisation');
	}
}

async function createOrganisation(data: FormData, userId: ObjectId) {
	const name = data.get('name') as string;
	const image_file = data.get('image') as File;

	if (!name) return fail(400, { error: 'Organisation Name is required' });

	const existingOrg = await Organisation.findOne({ createdBy: userId });
	if (existingOrg) return fail(400, { error: 'You already have an organisation' });

	let image: string = '/images/organisation-placeholder.png';
	if (image_file && image_file.size !== 0) image = await upload(image_file);

	const newOrganisation = new Organisation({
		name,
		image: image,
		createdBy: userId
	});

	await newOrganisation.save();
	await User.findByIdAndUpdate(userId, { organisation: newOrganisation._id });

	return { success: true };
}

async function editOrganisation(data: FormData) {
	const id = data.get('id') as string;
	const name = data.get('name') as string;
	const image = data.get('image') as File;

	const updateData: { name?: string; image?: string } = {};

	if (name !== '') updateData.name = name;

	if (image && image.size !== 0) {
		const { image: organisationImage } = await Organisation.findById(id).select('image');

		if (organisationImage !== '/images/organisation-placeholder.png') {
			await deleteFile(organisationImage);
		}

		updateData.image = await upload(image);
	}

	await Organisation.findByIdAndUpdate(id, updateData);

	return { success: true };
}

async function deleteOrganisation(data: FormData, userId: ObjectId) {
	const id = data.get('id') as string;

	if (!id) return fail(400, { error: 'Organisation ID is required' });

	const { organisation } = await User.findById(userId).select('organisation');

	if (id !== organisation.toString()) {
		return fail(400, { error: 'You can only delete your own organisation' });
	}

	const deletedOrganisation = await Organisation.findByIdAndDelete(id);

	const { image } = deletedOrganisation;
	if (image !== '/images/organisation-placeholder.png') await deleteFile(image);

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

		console.log('edit organisation');

		try {
			const data = await request.formData();

			return await editOrganisation(data);
		} catch (e) {
			console.error('Error updating organisation:', e);
			return fail(500, { error: 'Failed to update organisation' });
		}
	},
	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		console.log('delete organisation');

		try {
			const data = await request.formData();

			return await deleteOrganisation(data, locals.user.id);
		} catch (e) {
			console.error('Error removing organisation:', e);
			return fail(500, { error: 'Failed to remove organisation' });
		}
	}
};
