import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Material } from '$src/types';
import Materials from '$db/schemas/Material';
import { upload } from '$lib/server/storage';
import Lessons from '$db/schemas/Lesson';
import Recording from '$db/schemas/Recording';
import { StreamClient } from '@stream-io/node-sdk';
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

function validateLecturer(locals: any) {
	if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');
}

async function saveRecording(data: FormData) {
	const video_file = data.get('video') as File;
	const lesson_id = data.get('LessonID') as string;
	const lesson = await Lessons.findById(lesson_id);

	if (!lesson) return fail(404, { message: 'Lesson not found' });

	const url: string = await upload(video_file);

	const newRecording = new Recording({
		url,
		date: lesson.date,
		time: lesson.time,
		topic: lesson.topic,
		workspace: lesson.workspace,
		description: lesson.description
	});

	await newRecording.save();

	return { success: true };
}

async function tokenProvider(id: string, streamClient: StreamClient) {
	const issuedAt = Math.floor(Date.now() / 1000) - 60;
	const expirationTime = Math.floor(Date.now() / 1000) + 3600;
	return streamClient.createToken(id, expirationTime, issuedAt);
}

function formatMaterial(material: any): Partial<Material> {
	return {
		title: material.title,
		description: material.description,
		file_path: material.file_path,
		thumbnail: material.thumbnail,
		type: material.type,
		id: material._id.toString()
	};
}

async function getMaterials(workspace_id: string): Promise<Partial<Material>[]> {
	const materials = await Materials.find({ workspace_id });
	return materials.map(formatMaterial);
}

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
	}
};
