/** @type {import('./$types').Actions} */

// Mock edit details function
async function editDetails(org_name, image_file) {
    if(org_name){
        console.log(org_name);
    }
    if(image_file){
        console.log(image_file.name);
    }
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const orgName = formData.get('org_name');
		const imageFile = formData.get('image');

		console.log('Organisation Name: ', orgName);

		if (imageFile instanceof File) {
			console.log('Received file');
			console.log('File name: ', imageFile.name);
			console.log('File type: ', imageFile.type);
			console.log('File size: ', imageFile.size);
		} else {
			console.log('No file received');
		}

	    await editDetails(orgName, imageFile);

		return {
			status: 200
        };
	}
};