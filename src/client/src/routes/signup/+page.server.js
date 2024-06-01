/** @type {import('./$types').Actions} */
// Mock sign-in function
async function signUp(name, email, password, org_name, image_file) {
	console.log(name);
	console.log(email);
	console.log(password);
	console.log(org_name);
	console.log(image_file.name);
	// In a real application, you would send these credentials to your server
	// and get an access token in response. Here we're just generating a mock token.
	const mockToken = 'mocktoken12345678910';
	return mockToken;
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirm_password');
		const orgName = formData.get('org_name');
		const terms = formData.get('terms');
		const imageFile = formData.get('image');

		console.log('Name: ', name);
		console.log('Email: ', email);
		console.log('Password: ', password);
		console.log('Confirm Password: ', confirmPassword);
		console.log('Organisation Name: ', orgName);

		if (imageFile instanceof File) {
			console.log('Received file');
			console.log('File name: ', imageFile.name);
			console.log('File type: ', imageFile.type);
			console.log('File size: ', imageFile.size);
		} else {
			console.log('No file received');
		}
		console.log('Terms: ', terms);

		// Call the mock sign-in function and store the access token
		const token = await signUp(name, email, password, orgName, imageFile);
		// Return status and token
		return {
			status: 200,
			accessToken: token
		};
	}
};
