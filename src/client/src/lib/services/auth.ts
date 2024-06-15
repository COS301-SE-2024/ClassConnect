import axios from 'axios';

export async function signIn(username: string, password: string): Promise<any> {
	try {
		const response = await axios.post('http://localhost:3000/signin', {
			username,
			password
		});

		return response.data;
	} catch (error) {
		throw new Error('Sign-in failed');
	}
}

export async function signUp(
	name: string,
	surname: string,
	email: string,
	image: string,
	password: string
): Promise<any> {
	try {
		const response = await axios.post('http://localhost:3000/signup', {
			name,
			email,
			image,
			surname,
			password,
			role: 'admin'
		});

		return response.data;
	} catch (error) {
		throw new Error('Sign-up failed');
	}
}
