import { error, redirect } from '@sveltejs/kit';

import User from '$db/schemas/User';
import Quiz from '$db/schemas/Quiz';
import Workspace from '$db/schemas/Workspace';
import { createPasswordResetToken } from '$lib/server/utils/auth';

export async function load({ locals, params, url }) {
	if (!locals.user) throw redirect(302, '/signin');

	const token = await createPasswordResetToken(locals.user.id);

	if (
		!locals.user.custom_password &&
		!url.pathname.includes('reset-password', 'signin', 'signup')
	) {
		throw redirect(303, `/reset-password/${token}`);
	}

	try {
		const user = await User.findById(locals.user.id).populate('workspaces');

		const workspacesMap = user.workspaces.reduce((acc, workspace) => {
			acc[workspace._id.toString()] = workspace.name;

			return acc;
		}, {});

		const quizzes = await Quiz.find({ owner: params.workspace }).select('title');

		const quizzesMap = quizzes.reduce((acc, quiz) => {
			acc[quiz._id.toString()] = quiz.title;

			return acc;
		}, {});

		let formattedWorkspace = null;

		if (params.workspace) {
			const workspace = await Workspace.findById(params.workspace).select('name image');

			if (!workspace) throw error(404, 'Workspace not found');

			formattedWorkspace = {
				name: workspace.name,
				image: workspace.image
			};
		}

		return {
			name: user.name,
			image: user.image,
			role: locals.user.role,
			workspace: formattedWorkspace,
			maps: { workspacesMap, quizzesMap }
		};
	} catch (e) {
		console.error('Error occured:', e);
		throw error(500, 'An error occurred while loading page.');
	}
}
