import { error, redirect } from '@sveltejs/kit';

import User from '$db/schemas/User';
import Workspace from '$db/schemas/Workspace';
import { createPasswordResetToken } from '$lib/server/utils/auth';

export async function load({ locals, params, url }) {
	if (!locals.user) redirect(302, '/signin');

	const token = await createPasswordResetToken(locals.user.id);

	if (!locals.user.custom_password && !url.pathname.includes('reset-password')) {
		throw redirect(303, `/reset-password/${token}`);
	}

	try {
		const user = await User.findById(locals.user.id);
		if (!user) throw error(404, 'User not found');

		if (params.workspace) {
			const workspace = await Workspace.findById(params.workspace).select('name image');
			if (!workspace) throw error(404, 'Workspace not found');

			const formattedWorkspace = {
				name: workspace.name,
				image: workspace.image
			};

			return {
				name: user.name,
				image: user.image,
				role: locals.user.role,
				workspace: formattedWorkspace || null
			};
		}

		return {
			name: user.name,
			image: user.image,
			role: locals.user.role
		};
	} catch (e) {
		console.error('Error fetching workspace:', e);
		throw error(500, 'An error occurred while loading page.');
	}
}
