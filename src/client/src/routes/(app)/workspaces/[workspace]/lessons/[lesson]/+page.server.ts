import { username } from '$src/lib/store/lessons';
import { StreamClient } from '@stream-io/node-sdk';

import { STREAM_API_KEY, STREAM_SECRET_KEY } from '$env/static/private';

export const load = async () => {
	if (!username) throw new Error('User is not authenticated');
	if (!STREAM_API_KEY) throw new Error('Stream API key secret is missing');
	if (!STREAM_SECRET_KEY) throw new Error('Stream API secret is missing');

	const streamClient = new StreamClient(STREAM_API_KEY, STREAM_SECRET_KEY);

	const tokenProvider = async () => {
		const expirationTime = Math.floor(Date.now() / 1000) + 3600;
		const issuedAt = Math.floor(Date.now() / 1000) - 60;
		const token = streamClient.createToken(username, expirationTime, issuedAt);
		return token;
	};

	const token = await tokenProvider();

	return { apiKey: STREAM_API_KEY, token };
};
