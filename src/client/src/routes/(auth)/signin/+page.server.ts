import User from '$db/schemas/User';
import type { Actions } from './$types';
import { lucia } from '$lib/server/auth';
import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user) redirect(302, '/home');
}

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const username = formData.get('username');
		const password = formData.get('password');

		if (typeof username !== 'string' || username.length === 0) {
			return fail(400, {
				error: 'Invalid name'
			});
		}

		if (typeof password !== 'string' || password.length === 0) {
			return fail(400, {
				error: 'Invalid password'
			});
		}

		try {
			const user = await User.findOne({ username });

			if (!user) {
				return fail(400, {
					error: 'Username does not exist'
				});
			}

			const valid = await verify(user.password, password);

			if (!valid) {
				return fail(400, {
					error: 'Incorrect password'
				});
			}

			const session = await lucia.createSession(user._id, { role: user.role });
			const sessionCookie = lucia.createSessionCookie(session.id);

			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			console.log('Error', e);

			return {
				error: 'An unknown error occurred'
			};
		}

		redirect(302, '/');
	}
};
