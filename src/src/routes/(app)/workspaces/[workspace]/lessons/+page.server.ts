import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { validateLecturer } from '$src/lib/server/utils';
import {
	getLessons,
	getRecordings,
	scheduleLesson,
	editLesson,
	deleteLesson,
	deleteRecording
} from '$src/lib/server/utils/lessons';

export async function load({ locals, params }) {
	try {
		const lessons = await getLessons(params.workspace);

		const recordings = await getRecordings(params.workspace);

		return {
			role: locals.user?.role,
			lessons,
			recordings
		};
	} catch (e) {
		console.error('Server error:', e);
		throw error(500, 'An unexpected error occurred while loading lessons');
	}
}

export const actions: Actions = {
	schedule: async ({ request, locals, params }) => {
		validateLecturer(locals);

		try {
			const data = await request.formData();

			return await scheduleLesson(data, params.workspace);
		} catch (e) {
			console.error('Error creating lesson:', e);
			return fail(500, { message: 'Failed to create lesson' });
		}
	},
	edit: async ({ request, locals }) => {
		validateLecturer(locals);

		try {
			const data = await request.formData();

			return await editLesson(data);
		} catch (err) {
			console.error('Error updating lesson:', err);
			return fail(500, { error: 'Failed to update lesson' });
		}
	},
	delete: async ({ request, locals }) => {
		validateLecturer(locals);

		try {
			const data = await request.formData();
			const id = data.get('id') as string;

			return await deleteLesson(id);
		} catch (e) {
			console.error('Error deleting lesson:', e);
			return fail(500, { message: 'Failed to delete lesson' });
		}
	},
	deleteRecording: async ({ request, locals }) => {
		validateLecturer(locals);

		try {
			const data = await request.formData();
			const id = data.get('id') as string;

			return await deleteRecording(id);
		} catch (e) {
			console.error('Error deleting lesson:', e);
			return fail(500, { message: 'Failed to delete lesson' });
		}
	}
};
