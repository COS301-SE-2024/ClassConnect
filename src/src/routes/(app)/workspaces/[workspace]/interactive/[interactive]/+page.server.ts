import type { Actions } from '@sveltejs/kit';
import { fail, error } from '@sveltejs/kit';
import { validateLecturer } from '$src/lib/server/utils';
import { getLectureNotes, getThreeDMaterials } from '$src/lib/server/utils/material';
import {
	getInteractiveLesson,
	createLessonNote,
	editContent,
	deleteContent,
	createMCQ,
	createThreeDNote,
	changeThreeDNoteObject,
	createAnnotation,
	deleteAnnotation,
	editAnnotation,
	answerMCQ
} from '$src/lib/server/utils/interactive';

export async function load({ locals, params }) {
	try {
		const materials = await getLectureNotes(params.workspace);
		const threeDMaterials = await getThreeDMaterials(params.workspace);
		const interactive = await getInteractiveLesson(params.interactive);
		return {
			role: locals.user?.role,
			materials,
			interactive,
			threeDMaterials
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
	createThreeDNote: async ({ request, locals, params }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			data.append('lesson', params.interactive as string);
			await createThreeDNote(data);
		} catch (e) {
			console.error('Error saving notes:', e);
			throw error(500, 'Failed to 3D note');
		}
	},
	changeObject: async ({ request, locals }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			const content_id = data.get('id') as string;
			const material_id = data.get('material') as string;
			await changeThreeDNoteObject(content_id, material_id);
		} catch (e) {
			console.error('Error saving notes:', e);
			throw error(500, 'Failed to change object');
		}
	},
	createAnnotation: async ({ request, locals }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			await createAnnotation(data);
		} catch (e) {
			console.error('Error creating annotation:', e);
			throw error(500, 'Failed to create annotation');
		}
	},
	deleteAnnotation: async ({ request, locals }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			const id = data.get('id') as string;
			await deleteAnnotation(id);
		} catch (e) {
			console.error('Error deleting annotation:', e);
			throw error(500, 'Failed to delete annotation');
		}
	},
	editAnnotation: async ({ request, locals }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			await editAnnotation(data);
		} catch (e) {
			console.error('Error editing annotation:', e);
			throw error(500, 'Failed to edit annotation');
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
	},
	answerMCQ: async ({ request, locals }) => {
		try {
			validateLecturer(locals);
			const data = await request.formData();
			const id = data.get('id') as string;
			const answer = data.get('answer') as string;
			const flag: boolean = await answerMCQ(id, answer);
			if (flag) {
				console.log('Correct Answer');
			} else {
				return error(500, { message: 'Incorrect Answer' });
			}
		} catch (e) {
			console.error('Error saving question:', e);
			return error(500, { message: 'Incorrect Answer' });
		}
	}
};
