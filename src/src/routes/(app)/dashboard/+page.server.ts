import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user?.role !== 'admin' && locals.user?.role !== 'student') {
		throw error(401, 'Unauthorised');
	}

	return { role: locals.user.role };
}
