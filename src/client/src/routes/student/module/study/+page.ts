/** @type {import('./$types').PageLoad} */
import one from '$lib/files/study-notes-one.pdf';
import two from '$lib/files/study-notes-two.pdf';
import three from '$lib/files/study-notes-three.pdf';

export function load() {
	/**
	 * Note to intergration:
	 * in the previous step you captured the module details and the user details are still as below
	 *
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
	 *	}
	 *
	 * the module details are as follows:
	 *
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
	 * the infomation above is only true if the the previos steps have be correctly followed
	 *
	 *
	 * Now what your job if is to take the modules array, and get all the study material stored in the workspace/module :additional note WORKSPACE === MODULE
	 *
	 * now we only look to capture the title, descrtiption and link of the study material and store it in and array as follows
	 * {
	 * 		materials: [
	 *		{
	 * 			title: 'Introduction to Computer Networks',
	 *			description:
	 *				'A foundational course covering the basics of computer networking, including network models, protocols, and architectures. (COS 332)',
	 *			link: one
	 *		},
	 *		{
	 * 			title: 'Advanced Networking Concepts',
	 *			description:
	 *				'An in-depth exploration of advanced networking topics such as routing algorithms, network security, and wireless networks. (COS 332)',
	 *			link: two
	 *		},
	 *	]
	 * }
	 *
	 * please make sure that the how the return object is returned is not
	 * altered as it is used in later stages, it is advised that you console log the
	 * current respose just to see what it look s like then you make sure that your respose is the exact same
	 *
	 */
	return {
		materials: [
			{
				title: 'Introduction to Computer Networks',
				description:
					'A foundational course covering the basics of computer networking, including network models, protocols, and architectures. (COS 332)',
				link: one
			},
			{
				title: 'Advanced Networking Concepts',
				description:
					'An in-depth exploration of advanced networking topics such as routing algorithms, network security, and wireless networks. (COS 332)',
				link: two
			},
			{
				title: 'Practical Network Design',
				description:
					'A hands-on course focusing on the design and implementation of network solutions for real-world applications. (COS 332)',
				link: three
			}
		]
	};
}
