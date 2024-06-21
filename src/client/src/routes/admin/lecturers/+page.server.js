/** @type {import('./$types').Actions} */

// Mock add, edit, and delete functions
async function addDetails(name, email, role) {
	console.log(name);
	console.log(email);
	console.log(role);
}

async function editDetails(name, email, role) {
	console.log(name);
	console.log(email);
	console.log(role);
}

async function deleteDetails(name, email, role) {
	console.log(name);
	console.log(email);
	console.log(role);
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('org_name');
		const email = formData.get('email');
		const role = formData.get('role');

		console.log(name);
		console.log(email);
		console.log(role);

		addDetails(name, email, role);

		return {
			status: 200
		};
	},
	edit: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('org_name');
		const email = formData.get('email');
		const role = formData.get('role');

		console.log(name);
		console.log(email);
		console.log(role);

		editDetails(name, email, role);

		return {
			status: 200
		};
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('org_name');
		const email = formData.get('email');
		const role = formData.get('role');

		console.log(name);
		console.log(email);
		console.log(role);

		deleteDetails(name, email, role);

		return {
			status: 200
		};
	}
};
