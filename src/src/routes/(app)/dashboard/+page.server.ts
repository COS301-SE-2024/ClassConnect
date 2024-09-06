import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user?.role !== 'admin' && locals.user?.role !== 'student') {
		throw error(401, 'Unauthorised');
	}

	let organisation;
	if (locals.user?.organisation) {
		organisation = JSON.parse(JSON.stringify(locals.user?.organisation));
	}

	return { role: locals.user.role, organisation };
}
