// @ts-nocheck
import type { Actions } from './$types';
import { lucia } from '$lib/server/auth';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) throw error(401);

	return { role: locals.user.role };
}

export const actions = {
	default: async (event: import('./$types').RequestEvent) => {
		if (!event.locals.session) throw error(404, 'Session not found');

		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
;null as any as Actions;