import type { ObjectId } from 'mongoose';
import type { Actions } from '@sveltejs/kit';
import { fail, error, redirect } from '@sveltejs/kit';
import { upload, deleteFile } from '$lib/server/storage';

import Users from '$db/schemas/User';
import Workspaces from '$db/schemas/Workspace';
import type { Workspace, User } from '$src/types';

function formatWorkspace(workspace: any, owner: string, image: string): Workspace {
	return {
		id: workspace._id.toString(),
		owner: owner,
		ownerImage: image,
		name: workspace.name,
		image: workspace.image,
		description: workspace.description || ''
	};
}

function formatUser(user: any): Partial<User> {
	return {
		id: user._id.toString(),
		name: user.name,
		surname: user.surname
	};
}

async function getWorkspaces(organisation: ObjectId): Promise<Workspace[]> {
	const workspaces = await Workspaces.find({ organisation });

	const formattedWorkspacesPromises = workspaces.map(async (workspace) => {
		const owner = await Users.findById(workspace.owner).select('name surname image');
		const ownerName = owner ? `${owner.name} ${owner.surname}` : 'Unknown';
		const ownerImage = owner ? owner.image : '';

		return formatWorkspace(workspace, ownerName, ownerImage);
	});

	return Promise.all(formattedWorkspacesPromises);
}

async function getLecturers(organisation: ObjectId): Promise<Partial<User>[]> {
	const lecturers = await Users.find({ role: 'lecturer', organisation }).select('name surname');
	return lecturers.map(formatUser);
}

async function getUserWorkspaces(userId: ObjectId): Promise<Workspace[]> {
	const user = await Users.findById(userId).select('workspaces');
	const workspaces = await Workspaces.find({ _id: { $in: user.workspaces } });

	return workspaces.map((workspace) => ({
		id: workspace._id.toString(),
		name: workspace.name,
		image: workspace.image,
		ownerImage: workspace.owner?.image || '',
		owner: workspace.owner?.toString() || '',
		description: workspace.description || ''
	}));
}

export async function load({ locals }) {
	if (!locals.user) return redirect(302, '/signin');

	try {
		if (locals.user.role === 'admin') {
			const [workspaces, lecturers] = await Promise.all([
				getWorkspaces(locals.user.organisation),
				getLecturers(locals.user.organisation)
			]);
			let organisation;
			if (locals.user.organisation !== undefined) {
				organisation = locals.user.organisation.toString() || null;
			}

			return { role: locals.user.role, lecturers, workspaces, organisation };
		} else {
			const workspaces = await getUserWorkspaces(locals.user.id);

			return { workspaces };
		}
	} catch (e) {
		console.error('Workspace error:', e);
		throw error(500, 'An error occurred while fetching workspaces');
	}
}

function validateAdmin(locals: any) {
	if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');
}

async function createWorkspace(data: FormData, organisation: ObjectId | undefined) {
	const name = data.get('name') as string;
	const owner = data.get('owner') as string;
	const image_file = data.get('image') as File;

	let image: string = '/images/workspace-placeholder.png';
	if (image_file && image_file.size !== 0) image = await upload(image_file);

	const newWorkspace = new Workspaces({
		name,
		owner,
		image,
		organisation
	});

	await Users.findByIdAndUpdate(owner, { $push: { workspaces: newWorkspace._id } });
	await newWorkspace.save();

	return { success: true };
}

async function editWorkspace(data: FormData) {
	const id = data.get('id') as string;
	const image = data.get('image') as File;
	const name = data.get('name') as string;
	const owner = data.get('owner') as string;
	const description = data.get('description') as string;

	const workspace = await Workspaces.findById(id);

	if (name !== '') workspace.name = name;
	if (description !== '') workspace.description = description;

	if (image && image.size !== 0) {
		if (workspace.image !== '/images/workspace-placeholder.png') {
			await deleteFile(workspace.image);
		}

		workspace.image = await upload(image);
	}

	if (owner && owner !== workspace.owner.toString()) {
		await Users.findByIdAndUpdate(workspace.owner, { $pull: { workspaces: workspace._id } });
		await Users.findByIdAndUpdate(owner, { $push: { workspaces: workspace._id } });

		workspace.owner = owner;
	}

	await workspace.save();

	return { success: true };
}

async function deleteWorkspace(id: string) {
	if (!id) return fail(400, { error: 'Workspace ID is required' });

	const deletedWorkspace = await Workspaces.findByIdAndDelete(id);
	if (!deletedWorkspace) return fail(404, { error: 'Workspace not found' });

	const { image } = deletedWorkspace;
	console.log('image', image);
	if (image && image !== '/images/workspace-placeholder.png') await deleteFile(image);

	await Users.findByIdAndUpdate(deletedWorkspace.owner, { $pull: { workspaces: id } });
	await Users.updateMany({ workspaces: id }, { $pull: { workspaces: id } });

	return { success: true };
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();

			return await createWorkspace(data, locals.user?.organisation);
		} catch (error) {
			console.error('Server error:', error);
			return fail(500, { error: 'Failed to add workspace' });
		}
	},
	edit: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();

			return await editWorkspace(data);
		} catch (err) {
			console.error('Error editing workspace:', err);
			return fail(500, { error: 'Failed to edit workspace' });
		}
	},
	delete: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();
			const id = data.get('id') as string;

			return await deleteWorkspace(id);
		} catch (err) {
			console.error('Error removing workspace:', err);
			return fail(500, { error: 'Failed to remove workspace' });
		}
	}
};
