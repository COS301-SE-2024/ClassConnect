import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) redirect(302, '/signin');
	if (locals.user.role !== 'admin') redirect(302, '/unauthorized');

	return { user: locals.user };
}
