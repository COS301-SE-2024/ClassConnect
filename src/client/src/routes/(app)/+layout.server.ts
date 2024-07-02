import User from '$db/schemas/User';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) redirect(302, '/signin');

	const user = await User.findById(locals.user.id);
	if (!user) throw error(404, 'User not found');

	return {
		name: user.name,
		role: user.role,
		image: user.image
	};
}
