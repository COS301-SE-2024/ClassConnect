import type { ObjectId } from 'mongoose';
import { getOrganisationDetails } from '$lib/server/organisation';
import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import type { UserData } from '$lib/store/types';
import type { Org } from '$lib/store/types';

import User from '$db/schemas/User';
import { lucia } from '$lib/server/auth';

export async function load({ locals }: { locals: { user: any } }) {
	if (locals.user) throw redirect(302, '/');
}

interface SignInData {
	username: string;
	password: string;
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

async function createSessionAndSetCookie(event: RequestEvent, userId: ObjectId, role: string) {
	const session = await lucia.createSession(userId, { role });
	const sessionCookie = lucia.createSessionCookie(session.id);

	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
}

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData()) as unknown as SignInData;

		const validationError = validateFormData(formData);

		if (validationError) return fail(400, validationError);

		try {
			const { user, error } = await authenticateUser(formData);

			if (error) return fail(400, { error });

			await createSessionAndSetCookie(event, user._id, user.role);

			let orgDet : Org = {
				id: '',
				org_name: '',
				image: ''
			};

			if (user.organisation && user.organisation !== '') {
				orgDet = await getOrganisationDetails(user.organisation);
			}

			const return_user: UserData = {
				first_name: user.name,
				last_name: user.surname,
				username: user.username,
				id: user._id.toString(),
				email: user.email,
				image: user.image,
				role: user.role,
				organisation: user.organisation,
				workspaces: user.workspaces,
				org: orgDet
			};

			return JSON.stringify(return_user);

		} catch (e) {
			console.error('Authentication error:', e);
			return fail(500, { error: 'An unknown error occurred' });
		}
	}
};
