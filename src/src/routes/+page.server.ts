import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user) {
		locals.user.role === 'lecturer' ? redirect(302, '/workspaces') : redirect(302, '/dashboard');
	}
}
