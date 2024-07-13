import { error } from '@sveltejs/kit';
import { StreamClient } from '@stream-io/node-sdk';
import { STREAM_API_KEY, STREAM_SECRET_KEY } from '$env/static/private';

import Users from '$db/schemas/User';
import type { User } from '$src/types';

export const load = async ({ locals }) => {
	if (!STREAM_API_KEY || !STREAM_SECRET_KEY) throw error(403, 'Stream credentials not set');

	const streamClient = new StreamClient(STREAM_API_KEY, STREAM_SECRET_KEY);

	const user = await Users.findById(locals.user?.id).select('name surname image');

	const formattedUser = {
		id: locals.user?.id.toString() || '',
		image: user.image,
		name: `${user.name} ${user.surname}`
	} as Partial<User>;

	const id = locals.user?.id.toString() || '';

	async function tokenProvider() {
		const issuedAt = Math.floor(Date.now() / 1000) - 60;
		const expirationTime = Math.floor(Date.now() / 1000) + 3600;

		return streamClient.createToken(id, expirationTime, issuedAt);
	}

	const token = await tokenProvider();

	return { apiKey: STREAM_API_KEY, user: formattedUser, token };
};
