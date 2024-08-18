import { fail } from '@sveltejs/kit';
import { sha256 } from 'oslo/crypto';
import type { ObjectId } from 'mongodb';
import type { Actions } from './$types';
import { encodeHex } from 'oslo/encoding';
import { TimeSpan, createDate } from 'oslo';
import { generateIdFromEntropySize } from 'lucia';

import User from '$db/schemas/User';
import PasswordResetToken from '$db/schemas/PasswordResetToken';
import { sendPasswordResetEmail } from '$lib/server/utils/email';

async function createPasswordResetToken(userId: string): Promise<string> {
	await PasswordResetToken.deleteMany({ user_id: userId });

	const tokenId = generateIdFromEntropySize(25);
	const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));

	await PasswordResetToken.create({
		user_id: userId,
		token_hash: tokenHash,
		expires_at: createDate(new TimeSpan(2, 'h'))
	});

	return tokenId;
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');

		if (!email || typeof email !== 'string') {
			return fail(400, { error: 'Invalid email' });
		}

		try {
			const user = (await User.findOne({ email }).select('email').lean()) as {
				_id: ObjectId;
				email: string;
			} | null;

			if (user) {
				const token = await createPasswordResetToken(user._id.toString());

				await sendPasswordResetEmail(email, token);
			}

			return {
				success: 'If an account exists with that email, a password reset link has been sent.'
			};
		} catch (error) {
			console.error('Password reset request failed:', error);
			return fail(500, {
				error: 'An error occurred while processing your request. Please try again.'
			});
		}
	}
};
