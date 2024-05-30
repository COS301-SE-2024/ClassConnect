/** @type {import('./$types').Actions} */

export const actions = {	
    default: async ({request}) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        const organisationType = formData.get('organisation_type');
        const orgName = formData.get('org_name');
        const terms = formData.get('terms');
        const imageFile = formData.get('upload_image');
        
        console.log('Name: ', name);
        console.log('Email: ', email);
        console.log('Password: ', password);
        console.log('Confirm Password: ', confirmPassword);
        console.log('Organisation Type: ', organisationType);
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
    }
};