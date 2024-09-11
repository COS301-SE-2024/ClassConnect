import { fail } from '@sveltejs/kit';
import Activities from '$db/schemas/Activity';
import type { Lesson, Recording } from '$src/types';
import Lessons from '$db/schemas/Lesson';
import Recordings from '$db/schemas/Recording';
import { deleteFile } from '$lib/server/storage';

function formatLesson(lesson: any): Partial<Lesson> {
	return {
		id: lesson._id.toString(),
		date: lesson.date,
		time: lesson.time,
		topic: lesson.topic,
		description: lesson.description
	};
}

function formatRecording(recording: any): Partial<Recording> {
	return {
		id: recording._id.toString(),
		date: recording.date,
		time: recording.time,
		topic: recording.topic,
		description: recording.description,
		url: recording.url
	};
}

export async function getLessons(workspace: string): Promise<Partial<Lesson>[]> {
	const lessons = await Lessons.find({ workspace });

	return lessons.map(formatLesson);
}

export async function getRecordings(workspace: string): Promise<Partial<Recording>[]> {
	const recordings = await Recordings.find({ workspace });

	return recordings.map(formatRecording);
}

export async function scheduleLesson(data: FormData, workspace: string) {
	const topic = data.get('topic') as string;
	const date = data.get('date') as string;
	const time = data.get('time') as string;
	const description = data.get('description') as string;

	if (!topic) return fail(400, { message: 'Topic is required' });
	if (!date) return fail(400, { message: 'Date is required' });
	if (!time) return fail(400, { message: 'Time is required' });

	const newLesson = new Lessons({
		time,
		topic,
		description,
		workspace,
		date: new Date(`${date}T${time}`)
	});

	await newLesson.save();
	//create activity
	const newActivity = new Activities({
		title: `New Lesson: ${topic}`,
		description: description || '',
		date: new Date(`${date}T${time}`),
		owner: workspace,
		type: 'lesson'
	});

	await newActivity.save();

	return { success: true };
}

export async function editLesson(data: FormData) {
	const id = data.get('id') as string;
	const date = data.get('date') as string;
	const time = data.get('time') as string;
	const topic = data.get('topic') as string;
	const description = data.get('description') as string;

	const updateData: { [key: string]: string | Date } = {};

	if (time !== '') updateData.time = time;
	if (topic !== '') updateData.topic = topic;
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

export async function deleteLesson(id: string) {
	if (!id) return fail(400, { error: 'Lesson ID is required' });

	const deletedLesson = await Lessons.findByIdAndDelete(id);
	if (!deletedLesson) return fail(404, { message: 'Lesson not found' });

	return { success: true };
}

export async function deleteRecording(id: string) {
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
