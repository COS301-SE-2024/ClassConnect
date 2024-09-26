import type { Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import { validateLecturer } from '$src/lib/server/utils';
import {
	getInteractiveLessons,
	createInteractiveLesson,
	deleteLesson,
	toggleavailability,
	editLesson
} from '$src/lib/server/utils/interactive';
import type { InteractiveLesson } from '$src/types';

export async function load({ locals, params }) {
	try {
		const interactive = await getInteractiveLessons(params.workspace);
		return {
			role: locals.user?.role,
			interactive
		};
	} catch (e) {
		console.error('Server error:', e);
		throw error(500, 'An unexpected error occurred while loading materials');
	}
}

export const actions: Actions = {
	createLesson: async ({ request, locals, params }) => {
		try {
			validateLecturer(locals);

			if (locals.user?.id === undefined) {
				return fail(401, { message: 'Unauthorized' });
			}
			const data = await request.formData();
			const title = data.get('title') as string;
			const description = data.get('description') as string;
			const instructions = data.get('instructions') as string;
			const owner = locals.user.id;
			const isAvailable = false;

			const Lesson: InteractiveLesson = {
				title,
				description,
				instructions,
				owner: owner.toString(),
				isAvailable,
				content: [],
				id: ''
			};

			const workspace_id = params.workspace;

			await createInteractiveLesson(workspace_id, Lesson);
		} catch (e) {
			console.error('Error creating lesson:', e);
			return fail(500, { message: 'Failed to create lesson' });
		}
	},
	deleteLesson: async ({ request, locals }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			const id = data.get('id') as string;
			await deleteLesson(id);
		} catch (e) {
			console.error('Error deleting lesson:', e);
			return fail(500, { message: 'Failed to delete lesson' });
		}
	},
	editLesson: async ({ request, locals }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();

			await editLesson(data);
		} catch (e) {
			console.error('Error editing lesson:', e);
			return fail(500, { message: 'Failed to edit lesson' });
		}
	},
	togglePublicaction: async ({ request, locals }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			await toggleavailability(data.get('id') as string);
			console.log(data);
		} catch (e) {
			console.error('Error making lesson public:', e);
			return fail(500, { message: 'Failed to make lesson public' });
		}
	}
};
