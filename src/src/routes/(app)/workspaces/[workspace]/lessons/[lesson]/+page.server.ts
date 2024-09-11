import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { StreamClient } from '@stream-io/node-sdk';
import { validateLecturer } from '$lib/server/utils';
import { getMaterials } from '$lib/server/utils/material';
import { tokenProvider, saveRecording, saveRecordingLink } from '$lib/server/utils/lesson';
import { STREAM_API_KEY, STREAM_SECRET_KEY } from '$env/static/private';
import Users from '$db/schemas/User';
import type { User } from '$src/types';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	if (!STREAM_API_KEY || !STREAM_SECRET_KEY) throw error(403, 'Stream credentials not set');

	try {
		const streamClient = new StreamClient(STREAM_API_KEY, STREAM_SECRET_KEY);

		const user = await Users.findById(locals.user?.id).select('name surname image');

		if (!user) throw error(404, 'User not found');

		const formattedUser: Partial<User> = {
			id: locals.user?.id.toString(),
			image: user.image,
			name: `${user.name} ${user.surname}`.trim()
		};

		const id = locals.user?.id.toString() || '';

		const materials = await getMaterials(params.workspace);

		const token = await tokenProvider(id, streamClient);

		return {
			token,
			materials,
			apiKey: STREAM_API_KEY,
			user: formattedUser,
			role: locals.user?.role
		};
	} catch (err) {
		console.error('Error in Lesson load function:', err);
		throw error(500, 'An unexpected error occurred while loading lesson');
	}
};

export const actions: Actions = {
	SaveRecording: async ({ request, locals }) => {
		validateLecturer(locals);
		try {
			const data = await request.formData();

			return await saveRecording(data);
		} catch (e) {
			console.error('Error saving recording:', e);
			return fail(500, { message: 'Failed to save recording' });
		}
	},
	SaveRecordingLink: async ({ request, locals }) => {
		validateLecturer(locals);
		try {
			const data = await request.formData();

			return await saveRecordingLink(data);
		} catch (e) {
			console.error('Error saving recording:', e);
			return fail(500, { message: 'Failed to save recording' });
		}
	}
};
