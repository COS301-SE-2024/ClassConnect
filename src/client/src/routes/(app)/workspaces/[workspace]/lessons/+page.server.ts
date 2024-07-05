import { error, fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

import Lesson from '$db/schemas/Lesson';

export async function load({ locals, params }) {
	try {
		const lessons = await Lesson.find({ workspace: params.workspace });

		const formattedLessons = lessons.map((lesson) => ({
			date: lesson.date,
			time: lesson.time,
			topic: lesson.topic,
			id: lesson._id.toString(),
			description: lesson.description
		}));

		return {
			role: locals.user?.role,
			lessons: formattedLessons
		};
	} catch (e) {
		console.error('Server error:', e);
		throw error(500, 'An unexpected error occurred while loading lessons');
	}
}

export const actions: Actions = {
	schedule: async ({ request, locals, params }) => {
		if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');

		const formData = await request.formData();
		const topic = formData.get('topic');
		const description = formData.get('description');
		const date = formData.get('date') as string;
		const time = formData.get('time') as string;

		if (!topic) return fail(400, { message: 'Topic is required' });
		if (!date) return fail(400, { message: 'Date is required' });
		if (!time) return fail(400, { message: 'Time is required' });

		try {
			const newLesson = new Lesson({
				time,
				topic,
				description,
				workspace: params.workspace,
				date: new Date(`${date}T${time}`)
			});

			await newLesson.save();

			return { success: true };
		} catch (e) {
			console.error('Error creating lesson:', e);
			return fail(500, { message: 'Failed to create lesson' });
		}
	},

	edit: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');

		const data = await request.formData();
		const id = data.get('id') as string;
		const date = data.get('date') as string;
		const time = data.get('time') as string;
		const topic = data.get('topic') as string;
		const description = data.get('description') as string;

		try {
			const updateData: { [key: string]: string | Date } = {};

			if (time !== '') updateData.time = time;
			if (topic !== '') updateData.topic = topic;
			if (description !== '') updateData.description = description;

			if (date !== '' && time !== '') {
				updateData.date = new Date(`${date}T${time}`);
			} else if (date !== '') {
				const lesson = await Lesson.findById(id);
				const currentTime = lesson.date.toTimeString().split(' ')[0];

				updateData.date = new Date(`${date}T${currentTime}`);
			} else if (time !== '') {
				const lesson = await Lesson.findById(id);
				const currentDate = lesson.date.toISOString().split('T')[0];

				updateData.date = new Date(`${currentDate}T${time}`);
			}

			const updatedLesson = await Lesson.findByIdAndUpdate(id, updateData, {
				new: true
			});

			if (!updatedLesson) return fail(404, { error: 'Lesson not found' });

			return { success: true };
		} catch (err) {
			console.error('Error updating lesson:', err);
			return fail(500, { error: 'Failed to update lesson' });
		}
	},

	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Lesson ID is required' });

		try {
			const deletedLesson = await Lesson.findByIdAndDelete(id);

			if (!deletedLesson) return fail(404, { message: 'Lesson not found' });

			return { success: true };
		} catch (e) {
			console.error('Error deleting lesson:', e);
			return fail(500, { message: 'Failed to delete lesson' });
		}
	}
};
