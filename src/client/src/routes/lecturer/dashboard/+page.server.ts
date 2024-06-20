/** @type {import('./$types').Actions} */

export const actions = {
    upload: async ({ request }) => {
        try {
            const formData = await request.body;

            if(formData){
                console.log(formData)
                // Get the form field values
                const title = formData.get('title');
                const description = formData.get('description');
                const file = formData.get('file');
    
                // Log the extracted data
                console.log('Title:', title);
                console.log('Description:', description);
    
                // Ensure the file is present
                if (!file) {
                    throw new Error('File is required');
                }
    
                // Log some file data
                console.log('File Name:', file.name);
                console.log('File Size:', file.size);
                console.log('File Type:', file.type);

            }
            console.log('no form data')
        } catch (error) {
            console.error('Error during file upload:', error);
            return {
                error: error.message
            };
        }
    },

    delete: async ({ request }) => {
        try {
            const formData = await request.formData();
            //TODO: create the delete logic
            return formData;
        } catch (error) {
            console.error('Error during file deletion:', error);
            return {
                error: error.message
            };
        }
    }
};
