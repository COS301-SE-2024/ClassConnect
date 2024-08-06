import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import Activities from '$db/schemas/Activity';
import type { Lesson } from '$src/types';
import Lessons from '$db/schemas/Lesson';

function formatLesson(lesson: any): Partial<Lesson> {
	return {
		id: lesson._id.toString(),
		date: lesson.date,
		time: lesson.time,
		topic: lesson.topic,
		description: lesson.description
	};
}

async function getLessons(workspace: string): Promise<Partial<Lesson>[]> {
	const lessons = await Lessons.find({ workspace });

	return lessons.map(formatLesson);
}

export async function load({ locals, params }) {
	try {
		const lessons = await getLessons(params.workspace);

		const recordings = [
			{
				id: 'lesson1',
				topic: 'Introduction to Svelte',
				description: 'An introductory lesson on Svelte framework.',
				date: '2024-08-01',
				time: '10:00 AM',
				url: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4'
			},
			{
				id: 'lesson2',
				topic: 'Advanced Svelte Techniques',
				description: 'A lesson on advanced techniques in Svelte.',
				date: '2024-08-02',
				time: '2:00 PM',
				url: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4'
			}
		];

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

async function editLesson(data: FormData) {
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

async function deleteLesson(id: string) {
	if (!id) return fail(400, { error: 'Lesson ID is required' });

	const deletedLesson = await Lessons.findByIdAndDelete(id);
	if (!deletedLesson) return fail(404, { message: 'Lesson not found' });

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
	}
};
