import { fail } from '@sveltejs/kit';
import { sha256 } from 'oslo/crypto';
import { hash } from '@node-rs/argon2';
import { encodeHex } from 'oslo/encoding';
import { isWithinExpirationDate } from 'oslo';

import type { Actions } from './$types';

import User from '$db/schemas/User';
import { lucia } from '$lib/server/auth';
import Session from '$db/schemas/Session';
import { HASH_OPTIONS } from '$src/constants';
import { validatePassword } from '$lib/server/utils/auth';
import PasswordResetToken from '$db/schemas/PasswordResetToken';

export const actions: Actions = {
	default: async ({ request, params, locals, cookies }) => {
		const data = await request.formData();
		const password = data.get('password');
		const confirmPassword = data.get('confirmPassword');

		const verificationToken = params.token;

		if (
			!verificationToken ||
			!password ||
			!confirmPassword ||
			typeof verificationToken !== 'string' ||
			typeof password !== 'string' ||
			typeof confirmPassword !== 'string'
		) {
			return fail(400, { error: 'All fields are required' });
		}

		try {
			validatePassword(password, confirmPassword);
		} catch (error: any) {
			return fail(400, { error: error.message });
		}

		try {
			const tokenHash = encodeHex(await sha256(new TextEncoder().encode(verificationToken)));
			const token = await PasswordResetToken.findOne({ token_hash: tokenHash });

			if (token) {
				await PasswordResetToken.deleteOne({ token_hash: tokenHash });
			}

			if (!token || !isWithinExpirationDate(token.expires_at)) {
				return fail(400, { error: 'Invalid or expired password reset token' });
			}

			const hashedPassword = await hash(password, HASH_OPTIONS);

			await Session.deleteMany({ user_id: token.user_id.toString() });
			await User.findByIdAndUpdate(token.user_id, {
				password: hashedPassword,
				custom_password: true
			});

			if (locals.session) {
				await lucia.invalidateSession(locals.session.id);
				const sessionCookie = lucia.createBlankSessionCookie();

				cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
			}
		} catch (error) {
			console.error('Password reset failed:', error);
			return fail(500, {
				error: 'An error occurred while resetting your password. Please try again.'
			});
		}
	}
};
