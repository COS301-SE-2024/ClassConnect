import { upload } from '$lib/server/storage';
import Lessons from '$db/schemas/Lesson';
import Recording from '$db/schemas/Recording';
import { StreamClient } from '@stream-io/node-sdk';
import { fail } from '@sveltejs/kit';

export async function tokenProvider(id: string, streamClient: StreamClient) {
	const issuedAt = Math.floor(Date.now() / 1000) - 60;
	const expirationTime = Math.floor(Date.now() / 1000) + 3600;
	return streamClient.createToken(id, expirationTime, issuedAt);
}

export async function saveRecording(data: FormData) {
	const lesson_id = data.get('LessonID') as string;
	const video_file = data.get('video') as File;
	const Lesson = await Lessons.findById(lesson_id);

	if (!Lesson) return fail(404, { message: 'Lesson not found' });

	const topic: string = Lesson.topic;

	const description: string = Lesson.description;

	const time: string = Lesson.time;

	const date: Date = Lesson.date;

	const workspace = Lesson.workspace;

	const url: string = await upload(video_file);

	const newRecording = new Recording({
		topic,
		description,
		time,
		date,
		workspace,
		url
	});

	await newRecording.save();

	return { success: true };
}

export async function saveRecordingLink(data: FormData) {
	const lesson_id = data.get('LessonID') as string;
	const url: string = data.get('videolink') as string;
	const Lesson = await Lessons.findById(lesson_id);

	if (!Lesson) return fail(404, { message: 'Lesson not found' });

	if (!url) return fail(400, { message: 'No video link provided}' });

	const topic: string = Lesson.topic;

	const description: string = Lesson.description;

	const time: string = Lesson.time;

	const date: Date = Lesson.date;

	const workspace = Lesson.workspace;

	const newRecording = new Recording({
		topic,
		description,
		time,
		date,
		workspace,
		url
	});

	await newRecording.save();

	return { success: true };
}
