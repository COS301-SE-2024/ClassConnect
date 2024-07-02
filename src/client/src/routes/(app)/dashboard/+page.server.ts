import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user?.role !== 'admin' && locals.user?.role !== 'student') {
		redirect(302, '/workspace');
	}

	return {
		students: 0,
		lecturers: 0,
		workspaces: 0,
		role: locals.user.role
	};
}
