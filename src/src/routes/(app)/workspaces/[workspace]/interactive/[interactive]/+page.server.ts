import type { Actions } from '@sveltejs/kit';
import { fail, error } from '@sveltejs/kit';
import { validateLecturer } from '$src/lib/server/utils';
import { getLectureNotes } from '$src/lib/server/utils/material';
import {
	getInteractiveLesson,
	createLessonNote,
	editContent,
	deleteContent,
	createMCQ
} from '$src/lib/server/utils/interactive';

export async function load({ locals, params }) {
	try {
		const materials = await getLectureNotes(params.workspace);
		const interactive = await getInteractiveLesson(params.interactive);
		return {
			role: locals.user?.role,
			materials,
			interactive
		};
	} catch (e) {
		console.error('Server error:', e);
		throw error(500, 'An unexpected error occurred while loading materials');
	}
}

export const actions: Actions = {
	createQuestion: async ({ request, locals, params }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			data.append('lesson', params.interactive as string);
			data.append('question', 'Untitled question');
			data.append('options', 'Option 1');
			data.append('options', 'Option 2');
			data.append('answer', 'Option 1');
			data.append('description', 'Question description');
			await createMCQ(data);
		} catch (e) {
			console.error('Error saving question:', e);
			return fail(500, { message: 'Failed to save question' });
		}
	},
	createNote: async ({ request, locals, params }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			data.append('title', 'Untitled Note');
			data.append('content', '/placeholder_content.pdf');
			data.append('lesson', params.interactive as string);
			await createLessonNote(data);
		} catch (e) {
			console.error('Error saving notes:', e);
			return fail(500, { message: 'Failed to save notes' });
		}
	},
	editContent: async ({ request, locals, params }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			data.append('lesson', params.interactive as string);
			await editContent(data);
		} catch (e) {
			console.error('Error saving question:', e);
			return fail(500, { message: 'Failed to save question' });
		}
	},
	deleteContent: async ({ request, locals }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			await deleteContent(data);
		} catch (e) {
			console.error('Error deleting content:', e);
			return fail(500, { message: 'Failed to delete content' });
		}
	}
};
