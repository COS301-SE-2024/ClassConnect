import { error, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) redirect(302, '/signin');
	if (locals.user.role !== 'admin') throw error(401);
}
