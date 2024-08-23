import { fail } from '@sveltejs/kit';
import type { ObjectId } from 'mongodb';
import type { Actions } from './$types';

import User from '$db/schemas/User';
import { sendPasswordResetEmail } from '$lib/server/utils/email';
import { createPasswordResetToken } from '$lib/server/utils/auth';

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
