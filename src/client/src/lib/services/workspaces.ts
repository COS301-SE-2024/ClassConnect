import axios from 'axios';
import { wrkspcs } from '$lib/store';

// create workspace POST
export async function workspaces(
	name: string,
	organisationID: string,
	createdBy: string,
	users: string[],
	image: string
): Promise<any> {
	try {
		const response = await axios.post('http://localhost:3000/workspaces', {
			name: name,
			organisationID: organisationID,
			createdBy: createdBy,
			users: users,
			image: image
		});

		return response.data;
	} catch (error) {
		throw new Error('Create Workspace Failed');
	}
}

// get Workspace GET
export async function getWorkspace(id: string): Promise<any> {
	try {
		const response = await axios.get(`http://localhost:3000/workspaces/${id}`);
		return response.data;
	} catch (error) {
		throw new Error('Get Workspace Failed');
	}
}

export async function updateWorkspace(
	id: string,
	name: string,
	organisationID: string,
	users: string[],
	image: string
): Promise<any> {
	try {
		const response = await axios.put(`http://localhost:3000/workspaces/${id}`, {
			name: name,
			organisationID: organisationID,
			users: users,
			image: image
		});
		return response.data;
	} catch (error) {
		throw new Error('Update Workspace Failed');
	}
}

export async function deleteWorkspace(id: string): Promise<string> {
	try {
		const response = await axios.delete(`http://localhost:3000/workspaces/${id}`);
		return response.data.message;
	} catch (error) {
		throw new Error('Delete Workspace Failed');
	}
}

export async function set_workspaces() {
	try {
		const url = 'http://localhost:3000/workspaces/organisation/66782cb5370486e47cd2fe0b';

		const response = await axios.get(url);

		// Handle the response data
		const res_data = response.data;

		if (res_data) {
			if (res_data.length === 0) {
				wrkspcs.set([]);
				return {
					workspaces: []
				};
			} else {
				const wkspc = [];
				for (let i = 0; i < res_data.length; i++) {
					const new_work = {
						name: res_data[i].name,
						id: res_data[i]._id
					};
					wkspc.push(new_work);
				}
				wrkspcs.set(wkspc);
				return {
					workspaces: wkspc
				};
			}
		}
	} catch (error) {
		// Handle any errors
		console.error('Error making the GET request:', error);
	}

	return {
		workspaces: [
			{
				name: 'Computer Networks'
			},
			{
				name: 'Artificial Intelligence'
			},
			{
				name: 'Programming Languages'
			},
			{
				name: 'Computer Graphics'
			}
		]
	};
}
