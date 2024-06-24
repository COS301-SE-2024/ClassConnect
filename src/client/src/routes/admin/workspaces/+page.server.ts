/** @type {import('./$types').Actions} */
import axios from 'axios';
import { get } from 'svelte/store';
import { wrkspcs } from '$lib/store';

// Mock add, edit, and delete functions

async function addWorkspace(name_in, organisation_in, owner_in, image_in) {
	const url = 'http://localhost:3000/workspaces';

	const data = {
		name: name_in,
		organisation: organisation_in,
		owner: owner_in,
		image: image_in
	};

	const response = await axios.post(url, data);

	const workspaces = get(wrkspcs);

	const new_work = {
		name: response.data.name,
		id: response.data._id
	};

	workspaces.push(new_work);

	wrkspcs.set(workspaces);

	return response.data;
}

async function editWorkspace(name_in, id, image_in) {
	const url = 'http://localhost:3000/workspaces/' + id;

	const data = {
		name: name_in,
		image: image_in
	};

	const response = await axios.put(url, data);

	const old_workspaces = get(wrkspcs);

	const new_workspaces = [];

	const new_work = {
		name: response.data.name,
		id: response.data._id
	};

	for (let i = 0; i < old_workspaces.length; i++) {
		if (old_workspaces[i].id !== new_work.id) {
			new_workspaces.push(old_workspaces[i]);
		}
	}

	new_workspaces.push(new_work);

	wrkspcs.set(new_workspaces);

	return response.data;
}

async function addUserToWorkspace(user, workspaces_in) {
	const url = 'http://localhost:3000/users/' + user;

	const data = {
		workspaces: workspaces_in
	};

	try {
		const response = await axios.put(url, data);

		return response.data;
	} catch (error) {
		console.log(error);
	}
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
		const image =
			'https://seeklogo.com/images/U/university-of-pretoria-logo-353892E0F3-seeklogo.com.png';

		try {
			const res = await addWorkspace(name, organisationId, createdBy, image);

			return {
				status: 200,
				body: res
			};
		} catch (error) {
			console.log(error);
			return {
				status: 500
			};
		}
	},
	adduser: async ({ request }) => {
		const formData = await request.formData();
		const user = formData.get('userId');
		const workspaces = formData.get('Workspaces');

		try {
			await addUserToWorkspace(user, workspaces);

			return {
				status: 200
			};
		} catch (error) {
			console.log(error);
			return {
				status: 500
			};
		}
	},
	edit: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('work_name');
		const id = formData.get('work_id');
		const image =
			'https://seeklogo.com/images/U/university-of-pretoria-logo-353892E0F3-seeklogo.com.png';

		console.log(name);
		console.log(id);
		console.log(image);

		try {
			const res = await editWorkspace(name, id, image);

			return {
				status: 200,
				body: res
			};
		} catch (error) {
			console.log(error);
			return {
				status: 500
			};
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
