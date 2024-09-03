import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

import Lessons from '$db/schemas/Lesson';
import Activities from '$db/schemas/Activity';
import Recordings from '$db/schemas/Recording';
import { deleteFile } from '$lib/server/storage';

function formatLesson(lesson: any): Partial<Lesson> {
	return {
		id: lesson._id.toString(),
		date: lesson.date,
		time: lesson.time,
		topic: lesson.topic,
		recurrence: lesson.recurrence,
		description: lesson.description
	};
}

function formatRecording(recording: any): Partial<Recording> {
	return {
		id: recording._id.toString(),
		url: recording.url,
		date: recording.date,
		time: recording.time,
		topic: recording.topic,
		description: recording.description
	};
}

async function getLessons(workspace: string): Promise<Partial<Lesson>[]> {
	const lessons = await Lessons.find({ workspace });

	const today = new Date();
	return lessons.map((lesson) => {
		if (lesson.recurrence === 'daily') {
			lesson.date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
		}

		if (lesson.recurrence === 'weekly') {
			const daysDiff = today.getDay() - lesson.date.getDay();
			const adjustedDate = new Date(today);
			adjustedDate.setDate(today.getDate() - daysDiff);
			lesson.date = adjustedDate;
		}

		return formatLesson(lesson);
	});
}

async function getRecordings(workspace: string): Promise<Partial<Recording>[]> {
	const recordings = await Recordings.find({ workspace });

	return recordings.map(formatRecording);
}

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

function validateLecturer(locals: any) {
	if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');
}

async function scheduleLesson(data: FormData, workspace: string) {
	const topic = data.get('topic') as string;
	const date = data.get('date') as string;
	const time = data.get('time') as string;
	const recurrence = data.get('recurrence') as string;
	const description = data.get('description') as string;

	if (!topic) return fail(400, { message: 'Topic is required' });
	if (!date) return fail(400, { message: 'Date is required' });
	if (!time) return fail(400, { message: 'Time is required' });

	const newLesson = new Lessons({
		time,
		topic,
		workspace,
		recurrence,
		description,
		date: new Date(`${date}T${time}`)
	});

	await newLesson.save();

	const newActivity = new Activities({
		type: 'lesson',
		owner: workspace,
		title: `New Lesson: ${topic}`,
		description: description || '',
		date: new Date(`${date}T${time}`)
	});

	await newActivity.save();

	return { success: true };
}

async function editLesson(data: FormData) {
	const id = data.get('id') as string;
	const date = data.get('date') as string;
	const time = data.get('time') as string;
	const topic = data.get('topic') as string;
	const recurrence = data.get('recurrence') as string;
	const description = data.get('description') as string;

	const updateData: { [key: string]: string | Date } = {};

	if (time !== '') updateData.time = time;
	if (topic !== '') updateData.topic = topic;
	if (recurrence !== '') updateData.recurrence = recurrence;
	if (description !== '') updateData.description = description;

	if (date !== '' && time !== '') {
		updateData.date = new Date(`${date}T${time}`);
	} else if (date !== '' || time !== '') {
		const lesson = await Lessons.findById(id);
		const currentDate = lesson.date.toISOString().split('T')[0];
		const currentTime = lesson.date.toTimeString().split(' ')[0];

		updateData.date = new Date(`${date || currentDate}T${time || currentTime}`);
	}

	const updatedLesson = await Lessons.findByIdAndUpdate(id, updateData, { new: true });

	if (!updatedLesson) return fail(404, { error: 'Lesson not found' });

	return { success: true };
}

async function deleteLesson(id: string) {
	if (!id) return fail(400, { error: 'Lesson ID is required' });

	const deletedLesson = await Lessons.findByIdAndDelete(id);
	if (!deletedLesson) return fail(404, { message: 'Lesson not found' });

	return { success: true };
}

async function deleteRecording(id: string) {
	if (!id) return fail(400, { error: 'Lesson ID is required' });

	const recording = await Recordings.findById(id);

	if (!recording) return fail(404, { message: 'Recording not found' });

	try {
		await deleteFile(recording.url);
		await Recordings.findByIdAndDelete(id);
	} catch (e) {
		console.error('Error deleting recording:', e);
		await Recordings.findByIdAndDelete(id);
		return { success: true };
	}

	return { success: true };
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
