import axios from 'axios';

const PLACEHOLDER_IMAGE =
	'https://www.pngkey.com/png/full/73-730477_first-name-profile-image-placeholder-png.png';

export async function getUser(id: string): Promise<any> {
	try {
		const response = await axios.get(`http://localhost:3000/users/${id}`);
		return response.data;
	} catch (error) {
		throw new Error('Get User failed');
	}
}

export async function getUsers(filter: {}): Promise<any> {
	try {
		const response = await axios.get(`http://localhost:3000/users`, filter);
		return response.data;
	} catch (error) {
		throw new Error('Get Users failed');
	}
}

export async function createUser(
	name: string,
	surname: string,
	email: string,
	role: string
): Promise<any> {
	try {
		const response = await axios.post('http://localhost:3000/users', {
			role,
			name,
			email,
			surname,
			password: 'password123',
			image: PLACEHOLDER_IMAGE,
			organisation: localStorage.getItem('organisationID')
		});

		return response.data;
	} catch (error) {
		throw new Error('Create User failed');
	}
}

export async function updateUser(id: string, information: any): Promise<any> {
	try {
		const response = await axios.put(`http://localhost:3000/users/${id}`, { ...information });
		return response.data;
	} catch (error) {
		throw new Error('Update User failed');
	}
}

export async function deleteUser(id: string): Promise<string> {
	try {
		const response = await axios.delete(`http://localhost:3000/users/${id}`);
		return response.data.message;
	} catch (error) {
		throw new Error('Delete User failed');
	}
}
