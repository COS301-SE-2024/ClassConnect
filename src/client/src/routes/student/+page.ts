/** @type {import('./$types').PageLoad} */
import { get } from 'svelte/store';
import { user_details } from '$lib/store';

export function load() {
	const details = get(user_details);
	console.log('User details:', details);
	/**
	 * Note to intergration:
	 * now once the user logs in and the user details are stored in the store
	 * they should be as follows according to the api contract
	 *   {
	 *		"id": "60d21b4667d0d8992e610c85",
	 *		"username": "a24125634",
	 *		"name": "John",
	 *		"surname": "Doe",
	 *		"email": "johndoe@example.com",
	 *		"role": "admin",
	 * 		"organisations": ["60d21b4967d0d8992e610c86"],
	 *		"workspaces": ["60d21b4c67d0d8992e610c87"],
	 *		"image": "https://example.com/images/johndoe.jpg",
	 *		"createdAt": "2023-01-01T00:00:00.000Z",
	 *		"updatedAt": "2023-01-01T00:00:00.000Z",
	 *		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
	 *		}
	 *
	 * Now what your job if is to take the workspaces array, "workspaces": ["60d21b4c67d0d8992e610c87"],
	 * and fectch the details if of every a workspace a student is apart of according to the contact this
	 * should be the infomation on the workspaces you get
	 * {
	 *	"id": "60d21b4c67d0d8992e610c87",
	 *	"name": "Development",
	 *	"organisationId": "60d21b49667d0d8992e610c86",
	 *	"createdBy": "60d21b4667d0d8992e610c85",
	 *	"users": ["60d21b4667d0d8992e610c85"],
	 *	"image": "https://example.com/images/development.jpg",
	 *	"createdAt": "2023-01-01T00:00:00.000Z",
	 *	"updatedAt": "2023-01-01T00:00:00.000Z"
	 *	}
	 *
	 * now we only look to capture the name and id of the workspace and store it in and array as follows
	 * {
	 * 		modules: [
	 *		{
	 *			module_name: 'Computer Graphics',
	 *			module_id: '789123456'
	 *		},
	 *
	 * 		{
	 *			module_name: 'Programming Languages',
	 *			module_id: '789456123'
	 *		}
	 *	]
	 * }
	 *
	 * please make sure that the how the return object is returned is not
	 * altered as it is used in later stages, this return object should then be stored in a store named
	 * module_details, it is advised that you console log the
	 * current respose just to see what it look s like then you make sure that your respose is the exact same
	 *
	 */
	return {
		modules: [
			{
				module_name: 'Computer Networks',
				module_id: '123456789'
			},
			{
				module_name: 'Computer Graphics',
				module_id: '789123456'
			},
			{
				module_name: 'Programming Languages',
				module_id: '789456123'
			}
		]
	};
}
