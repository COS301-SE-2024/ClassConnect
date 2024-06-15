/** @type {import('./$types').PageLoad} */

export function load() {
	return {
		materials: [
            {
                title: 'Introduction to Computer Networks',
                description: 'A foundational course covering the basics of computer networking, including network models, protocols, and architectures. (COS 332)'
            },
            {
                title: 'Advanced Networking Concepts',
                description: 'An in-depth exploration of advanced networking topics such as routing algorithms, network security, and wireless networks. (COS 332)'
            },
            {
                title: 'Practical Network Design',
                description: 'A hands-on course focusing on the design and implementation of network solutions for real-world applications. (COS 332)'
            }
        ]
	};
}
