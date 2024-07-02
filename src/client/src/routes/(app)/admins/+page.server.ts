import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user.role !== 'admin') throw error(401);
}
