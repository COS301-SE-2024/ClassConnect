/** @type {import('./$types').Actions} */

// Mock sign-in function
async function signIn(email, password) {
	console.log(email);
	console.log(password);
	// In a real application, you would send these credentials to your server
	// and get an access token in response. Here we're just generating a mock token.
	const mockToken = 'mocktoken12345678910';
	return mockToken;
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		console.log('Email: ', email);
		console.log('Password: ', password);

		// Call the mock sign-in function and store the access token
		const token = await signIn(email, password);
		// Return status and token
		return {
			status: 200,
			accessToken: token
		};
	}
};
