/** @type {import('./$types').PageLoad} */
import one from '$lib/files/study-notes-one.pdf';
import two from '$lib/files/study-notes-two.pdf';
import three from '$lib/files/study-notes-three.pdf';

export function load() {
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
