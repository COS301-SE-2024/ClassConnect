import { error } from '@sveltejs/kit';

export function validateLecturer(locals: any) {
	if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');
}

export function validateAdmin(locals: any) {
	if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorized');
}

export async function validateStudent(locals: any) {
	if (!locals.user || locals.user.role !== 'student') throw error(401, 'Unauthorized');
}
