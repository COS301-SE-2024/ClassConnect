import Users from '$db/schemas/User';
import type { User } from '$src/types';
import type { ObjectId } from 'mongoose';

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
	if (locals.user) {
		const user_id: ObjectId = locals.user.id;
		const ret_user = await getUserDetails(user_id);

		return {
			user_data: ret_user
		};
	}
}

async function getUserDetails(user_id: ObjectId): Promise<User> {
	const USER = await Users.findById(user_id);
	const ret_user: User = {
		id: USER._id.toString(),
		name: USER.name,
		email: USER.email,
		image: USER.image,
		surname: USER.surname,
		username: USER.username
	};

	return ret_user;
}
