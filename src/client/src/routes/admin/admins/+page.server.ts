/** @type {import('./$types').PageLoad} */
/** @type {import('./$types').Actions} */
import type { Org_Admin } from '$lib/store/types';

async function getAdminsFromDB(): Promise<Org_Admin[]> {
    //TODO create the logic to get the admins from the database
    return [];
}

function generatePassword() {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '@$!%*?&';
    
    const allChars = lowerCase + upperCase + numbers + specialChars;

    function getRandomChar(charSet:string) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        return charSet[randomIndex];
    }

    // Ensure the password meets the requirements
    const passwordArray = [
        getRandomChar(lowerCase),
        getRandomChar(upperCase),
        getRandomChar(numbers),
        getRandomChar(specialChars),
    ];

    // Fill the remaining characters
    for (let i = 4; i < 8; i++) {
        passwordArray.push(getRandomChar(allChars));
    }

    // Shuffle the array to prevent predictable patterns
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }

    return passwordArray.join('');
}

export async function load({ url }) {

    try{
        const ret_admins : Org_Admin[] = await getAdminsFromDB();
        const orgID : string | null = url.searchParams.get('orgID');

        if(orgID ===null || orgID === undefined || orgID === ''){

            const test : Org_Admin ={
                id: "1",
                first_name: "John",
                last_name: "Doe",
                email: "test@email.com",
                username: "a24242424",
                image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
            }
    
            ret_admins.push(test);
    
            return{
                admins: ret_admins
            }

        }else{
            throw new Error('No organisation ID was provided')
        }

    }catch(e){
        console.log('Error getting admins from the database: ',e)
        return{
            admins: []
        }
    }
}

export const actions = {
	add: async ({ request }) => {
		try {
			const formData = await request.formData();
            const name = formData.get('name');
            const surname = formData.get('surname');
            const email = formData.get('email');
            const password = generatePassword();

            console.log('This is the name: ',name)
            console.log('This is the email: ',email)
            console.log('This is the surname: ',surname)
            console.log('This is the password: ',password);

		} catch (error) {
			console.error('Error during addition:', error);
			return { error };
		}
	},
	edit: async ({ request }) => {
		try {
			const formData = await request.formData();
            const id = await formData.get('adminID');
            const name = formData.get('name');
            const surname = formData.get('surname');
            const email = formData.get('email');

            console.log('This is the name: ',name)
            console.log('This is the surname: ',surname)
            console.log('This is the email: ',email)
            console.log('This is the id: ',id)

		} catch (error) {
			console.error('Error during edit:', error);
			return { error };
		}
	},
	delete: async ({ request }) => {
		try {
			const formData = await request.formData();;
            const id = formData.get('adminID');

            console.log('This is the ID of the user: ',id)

		} catch (error) {
			console.error('Error during deletion:', error);
			return { error };
		}
	}
};