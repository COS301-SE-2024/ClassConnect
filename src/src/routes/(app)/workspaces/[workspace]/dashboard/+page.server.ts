import { error, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) return redirect(302, '/signin');
	if (locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');
}
