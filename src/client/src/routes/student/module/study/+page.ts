/** @type {import('./$types').PageLoad} */
import axios from 'axios';
import one from '$lib/files/study-notes-one.pdf';
import two from '$lib/files/study-notes-two.pdf';
import three from '$lib/files/study-notes-three.pdf';

export async function load() {
	try {
		const url = 'http://localhost:3000/materials/workspace/1';

		const response = await axios.get(url);

		const mats = [];

		for (let i = 0; i < response.data.length; i++) {
			const mat = {
				title: response.data[i].title,
				description: response.data[i].description,
				link: response.data[i].file_path
			};
			mats.push(mat);
		}

		return {
			materials: mats
		};
	} catch (error) {
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
}
