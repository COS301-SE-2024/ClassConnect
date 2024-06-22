/** @type {import('./$types').Actions} */

// Mock add, edit, and delete functions

async function addWorkspace(name, organisationId, createdBy, image){
	console.log(name);
	console.log(organisationId);
	console.log(createdBy);
	console.log(image);

	//TODO: Based on the api contract you now have all the infomation to create a work space now just make the call;

}

async function editWorkspace(name, image){
	console.log(name);
	console.log(image);

	//TODO: Based on the api contract you now have all the infomation to edit a workspace now just make the call;

}

async function deleteDetails(name, email, role) {
	console.log(name);
	console.log(email);
	console.log(role);
}

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('work_name');
		const organisationId = formData.get('organisationId');
		const createdBy = formData.get('createdBy');
		const image = formData.get('image');

		console.log(name);
		console.log(organisationId);
		console.log(createdBy);
		console.log(image);

		try {
			await addWorkspace(name, organisationId, createdBy, image);

			return {
				status: 200
			};

		} catch (error) {
			console.log(error);
			return {
				status: 500
			}
		}
	},
	edit: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('work_name');
		const image = formData.get('image');

		console.log(name);
		console.log(image);

		try {
			await editWorkspace(name, image);

			return {
				status: 200
			};

		} catch (error) {
			console.log(error);
			return {
				status: 500
			}
		}
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
