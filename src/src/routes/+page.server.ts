import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user) {
		locals.user.role === 'admin' ? redirect(302, '/organisation') : redirect(302, '/workspaces');
	}
}
