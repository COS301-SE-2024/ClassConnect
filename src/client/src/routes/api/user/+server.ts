import { error } from '@sveltejs/kit';
import Users from '$db/schemas/User';
import type { ObjectId } from 'mongoose';

/** @type {import('./$types').RequestHandler} */

export async function GET({ locals }) {
    if(locals && locals.user) {
        const userID : ObjectId  = locals.user.id;
        
        if (!userID) {
            error(400, 'user id not found');
        }

        const USER = await Users.findById(userID);
        
        if (!USER) {
            error(404, 'user not found');
        }

        const ret_user = {
            name: USER.name,
            email: USER.email,
            image: USER.image,
            surname: USER.surname
        };

        return new Response(String(ret_user));;
    }else{
        error(401, 'Unauthorized');
    }
}
