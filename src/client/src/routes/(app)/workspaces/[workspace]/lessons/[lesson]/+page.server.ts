import { error } from '@sveltejs/kit';
import { StreamClient } from '@stream-io/node-sdk';
import { STREAM_API_KEY, STREAM_SECRET_KEY } from '$env/static/private';
import Users from '$db/schemas/User';
import type { User } from '$src/types';

export const load = async ({ locals }) => {
	if (!STREAM_API_KEY || !STREAM_SECRET_KEY) throw error(403, 'Stream credentials not set');

	console.log('Hello from load function');

	try {
		console.log('Hello from load function 1');

		const streamClient = new StreamClient(STREAM_API_KEY, STREAM_SECRET_KEY);

		console.log('Hello from load function 2');

		const user = await Users.findById(locals.user?.id).select('name surname image');

		if (!user) throw error(404, 'User not found');

		const formattedUser: Partial<User> = {
			id: locals.user?.id.toString(),
			image: user.image,
			name: `${user.name} ${user.surname}`.trim()
		};

		const id = locals.user?.id.toString() || '';

		async function tokenProvider() {
			const issuedAt = Math.floor(Date.now() / 1000) - 60;
			const expirationTime = Math.floor(Date.now() / 1000) + 3600;
			return streamClient.createToken(id, expirationTime, issuedAt);
		}

		const token = await tokenProvider();

		return { apiKey: STREAM_API_KEY, user: formattedUser, token };
	} catch (err) {
		console.error('Error in Lesson load function:', err);
		throw error(500, 'An unexpected error occurred while loading lesson');
	}
};
