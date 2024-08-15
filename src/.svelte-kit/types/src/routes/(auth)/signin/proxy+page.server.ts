// @ts-nocheck
import type { ObjectId } from 'mongoose';
import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';

import User from '$db/schemas/User';
import { retry_connection } from '$db/db';
import { lucia } from '$lib/server/auth';

export async function load({ locals }) {
	if (locals.user) {
		locals.user.role === 'lecturer' ? redirect(302, '/workspaces') : redirect(302, '/dashboard');
	}
}

function validateFormData(formData: SignInData): { error: string } | null {
	if (typeof formData.username !== 'string' || formData.username.length === 0)
		return { error: 'Invalid username' };

	if (typeof formData.password !== 'string' || formData.password.length === 0)
		return { error: 'Invalid password' };

	return null;
}

async function authenticateUser(
	formData: SignInData
): Promise<{ user: any; error: string | null }> {
	const user = await User.findOne({ username: formData.username });
	if (!user) return { user: null, error: 'Username does not exist' };

	const valid = await verify(user.password, formData.password);
	if (!valid) return { user: null, error: 'Incorrect password' };

	return { user, error: null };
}

async function createSessionAndSetCookie(
	event: RequestEvent,
	userId: ObjectId,
	role: string,
	organisation: ObjectId
) {
	const session = await lucia.createSession(userId, { role, organisation });
	const sessionCookie = lucia.createSessionCookie(session.id);

	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
}

export const actions = {
	default: async (event: import('./$types').RequestEvent) => {
		const formData = Object.fromEntries(await event.request.formData()) as unknown as SignInData;

		const validationError = validateFormData(formData);

		if (validationError) return fail(400, validationError);

		let role = '';

		try {
			await retry_connection();

			const { user, error } = await authenticateUser(formData);

			if (error) return fail(400, { error });

			role = user.role;
			const organisation = user.organisation || '';

			await createSessionAndSetCookie(event, user._id, role, organisation);
		} catch (e) {
			console.error('Authentication error:', e);

			return fail(500, { error: 'An unknown error occurred' });
		}

		role === 'lecturer' ? redirect(302, '/workspaces') : redirect(302, '/dashboard');
	}
};
;null as any as Actions;