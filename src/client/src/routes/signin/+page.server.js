/** @type {import('./$types').Actions} */

export const actions = {	
    default: async ({request}) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');
        console.log('Email: ', email);
        console.log('Password: ', password);
}};