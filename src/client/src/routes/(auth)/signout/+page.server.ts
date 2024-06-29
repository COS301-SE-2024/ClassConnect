import type { Actions } from './$types';
import { lucia } from '$lib/server/auth';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) throw error(401);
}

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
