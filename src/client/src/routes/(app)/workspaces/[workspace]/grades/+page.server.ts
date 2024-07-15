import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user?.role !== 'lecturer') throw error(401);
}
