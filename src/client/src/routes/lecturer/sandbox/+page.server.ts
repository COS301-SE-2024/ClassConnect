import type { RequestEvent } from '@sveltejs/kit';

export const actions = {
    default: async (event: RequestEvent) => {
        const formData = await event.request.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const file = formData.get('file');


        console.log('Received form data:', { title, description, file });

        return {
            success: true,
            message: 'Form submitted successfully'
        };
    }
};