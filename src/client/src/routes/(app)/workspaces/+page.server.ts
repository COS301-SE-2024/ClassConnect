import type { Actions } from '@sveltejs/kit';
import { fail, error, redirect } from '@sveltejs/kit';

import User from '$db/schemas/User';
import Workspace from '$db/schemas/Workspace';

async function getName(id: string) {
	const user = await User.findById(id).select('name surname');
	return user ? `${user.name} ${user.surname}` : 'Unknown';
}

export async function load({ locals }) {
	if (!locals.user) return redirect(302, '/signin');

	if (locals.user.role === 'admin') {
		try {
			const workspaces = await Workspace.find({ organisation: locals.user.organisation });

			const availableLecturers = await User.find({
				role: 'lecturer',
				workspaces: [],
				organisation: locals.user.organisation
			}).select('name surname');

			const formattedWorkspacesPromises = workspaces.map(async (workspace) => ({
				id: workspace._id.toString(),
				name: workspace.name,
				image: workspace.image,
				owner: await getName(workspace.owner)
			}));

			const formattedWorkspaces = await Promise.all(formattedWorkspacesPromises);

			const formattedLecturers = availableLecturers.map((lecturer) => ({
				id: lecturer._id.toString(),
				name: lecturer.name,
				surname: lecturer.surname
			}));

			return {
				role: locals.user.role,
				lecturers: formattedLecturers,
				workspaces: formattedWorkspaces
			};
		} catch (error) {
			console.error('Server error:', error);
			return fail(500, { error: 'An unexpected error occurred while fetching workspaces' });
		}
	} else {
		const user = await User.findById(locals.user.id).select('workspaces');

		const workspaces = await Workspace.find({ _id: { $in: user.workspaces } });

		const formattedWorkspaces = workspaces.map((workspace) => ({
			id: workspace._id.toString(),
			name: workspace.name,
			image: workspace.image,
			description: workspace.description || ''
		}));

		return {
			workspaces: formattedWorkspaces
		};
	}
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const name = data.get('name') as string;
		const owner = data.get('owner') as string;
		const image = data.get('image') as string;

		try {
			const newWorkspace = new Workspace({
				name,
				owner,
				organisation: locals.user.organisation,
				image: image || 'images/workspace-placeholder.svg'
			});

			const user = await User.findById(owner);
			user.workspaces.push(newWorkspace._id);

			await user.save();
			await newWorkspace.save();

			return { success: true };
		} catch (error) {
			console.error('Server error:', error);
			return fail(500, { error: 'Failed to add workspace' });
		}
	},
	edit: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Workspace ID is required' });

		try {
			const workspace = await Workspace.findById(id);
			if (!workspace) return fail(404, { error: 'Workspace not found' });

			const name = data.get('name') as string | null;
			const owner = data.get('owner') as string | null;
			const image = data.get('image') as string | null;

			if (name) workspace.name = name;
			if (image) workspace.image = image;

			console.log(owner);

			if (owner && owner !== workspace.owner.toString()) {
				await User.findByIdAndUpdate(workspace.owner, { $pull: { workspaces: workspace._id } });
				await User.findByIdAndUpdate(owner, { $push: { workspaces: workspace._id } });

				workspace.owner = owner;
			}

			await workspace.save();

			return { success: true };
		} catch (err) {
			console.error('Error editing workspace:', err);
			return fail(500, { error: 'Failed to edit workspace' });
		}
	},
	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Workspace ID is required' });

		try {
			const deletedWorkspace = await Workspace.findByIdAndDelete(id);
			if (!deletedWorkspace) return fail(404, { error: 'Workspace not found' });

			await User.findByIdAndUpdate(deletedWorkspace.owner, { $pull: { workspaces: id } });

			await User.updateMany({ workspaces: id }, { $pull: { workspaces: id } });

			return { success: true };
		} catch (err) {
			console.error('Error removing workspace:', err);
			return fail(500, { error: 'Failed to remove workspace' });
		}
	}
};
