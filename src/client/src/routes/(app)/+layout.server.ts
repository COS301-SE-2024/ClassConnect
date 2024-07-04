import { error, redirect } from '@sveltejs/kit';

import User from '$db/schemas/User';
import Workspace from '$db/schemas/Workspace';

export async function load({ locals, params }) {
	if (!locals.user) redirect(302, '/signin');

	try {
		const user = await User.findById(locals.user.id);
		if (!user) throw error(404, 'User not found');

		if (params.id) {
			const workspace = await Workspace.findById(params.id).select('name image');
			if (!workspace) throw error(404, 'Workspace not found');

			const formattedWorkspace = {
				name: workspace.name,
				image: workspace.image
			};

			return {
				name: user.name,
				image: user.image,
				workspace: formattedWorkspace || null,
				role: locals.user.role as any
			};
		}

		return {
			name: user.name,
			image: user.image,
			role: locals.user.role as any
		};
	} catch (err) {
		console.error('Error fetching workspace:', err);
		throw error(500, 'An error occurred while fetching the workspace');
	}
}
