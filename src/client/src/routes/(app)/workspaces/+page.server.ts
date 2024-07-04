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
	if (locals.user.role !== 'admin') throw error(401, 'Unauthorized');

	try {
		const workspaces = await Workspace.find({ organisation: locals.user.organisation }).select(
			'_id name image owner'
		);

		const availableLecturers = await User.find({
			organisation: locals.user.organisation,
			workspaces: []
		}).select('_id name');

		const formattedWorkspacesPromises = workspaces.map(async (workspace) => ({
			id: workspace._id.toString(),
			name: workspace.name,
			image: workspace.image,
			owner: await getName(workspace.owner)
		}));

		const formattedWorkspaces = await Promise.all(formattedWorkspacesPromises);

		const formattedLecturers = availableLecturers.map((lecturer) => ({
			id: lecturer._id.toString(),
			name: lecturer.name
		}));

		return {
			lecturers: formattedLecturers,
			workspaces: formattedWorkspaces
		};
	} catch (error) {
		console.error('Server error:', error);
		return fail(500, { error: 'An unexpected error occurred while fetching workspaces' });
	}
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorized');

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
	}
};
