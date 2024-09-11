import { json } from '@sveltejs/kit';
import Users from '$db/schemas/User';
import type { User } from '$src/types';

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
	// Check if user is not authenticated
	if (locals.user) {
		// Extract the workID from query parameters
		const userID = locals.user.id;

		if (userID) {
			try {
				// Find user by ID
				const user = await Users.findById(userID);

				// Check if workspace exists
				if (!userID) {
					return json({ error: 'User not found' }, { status: 404 });
				}

				// Prepare and return the user data
				const ret_user: User = {
					id: userID.toString(),
					name: user.name,
					email: user.email,
					image: user.image,
					surname: user.surname,
					username: user.username
				};
				return json(ret_user);
			} catch (err) {
				//console.error('Error fetching user:', err);
				return json({ error: 'Internal Server Error' }, { status: 500 });
			}
		} else {
			return json({ error: 'Missing userID parameter' }, { status: 400 });
		}
	} else {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
}
