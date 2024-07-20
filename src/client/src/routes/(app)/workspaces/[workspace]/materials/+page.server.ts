import type { Actions } from './$types';
import Materials from '$db/schemas/Material';
import type {Material} from '$src/types';
import { fail, error } from '@sveltejs/kit';
import {upload,deleteFile} from '$lib/server/s3Bucket';


function formatMaterial(material:any):Partial<Material>{
    return {
        title : material.title,
        description : material.description,
        type : material.type
    };
}
 
 


async function getMaterials(workspace_id:string,type:boolean):Promise<Partial<Material>[]>{
    const materials = await Materials.find({workspace_id});
    console.log(materials)
    return materials.map(formatMaterial);
}
//Function to Upload Materials
async function uploadMaterials(data: FormData, workspace_id: string, typeSet: boolean) {
	const title = data.get('title') as string;
	const description = data.get('description') as string;
	const file_path = (await upload(data.get('file') as File)) as string;
	const type = typeSet; //TODO: Should account for differnt types of Materials.

	if (!title) return fail(400, { message: 'Title is required' });
	if (!description) return fail(400, { message: 'Description is required' });
	if (!file_path) return fail(400, { message: 'File to upload required' });

    const newMaterial = new Materials({
        title,
        description,
        file_path,
        type,
        workspace_id
    });
    await newMaterial.save();
    return {success:true}


}

export async function load({ locals, params }) {
	try {
		const materials = await getMaterials(params.workspace,false);
        console.log(materials)
		return {
			role: locals.user?.role,
			materials
		};
	} catch (e) {
		console.error('Server error:', e);
		throw error(500, 'An unexpected error occurred while loading lessons');
	}
}

function validateLecturer(locals: any) {
	if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');
}
//Deleting a Material
async function deleteMaterial(id: string) {
	if (!id) return fail(400, { message: 'Material ID is required' });

    const deletedMaterial = await Materials.findByIdAndDelete(id);

    if(!deletedMaterial) return fail(404,{message:'Material not found'});
    console.log("Material:" + deletedMaterial);
    return {success:true};
}

export const actions: Actions = {
    uploadMat: async ({request,locals,params}) => {
        validateLecturer(locals);
    
        try{
        const data = await request.formData();
        return await uploadMaterials(data,params.workspace,true);
        }catch(e){
            console.error('Error uploading material:', e);
            return fail(500, { message: 'Failed to upload material' });
        }
    },
    deleteMat: async ({request,locals}) => {
        validateLecturer(locals);
        try{
            const data = await request.formData();
            const id = data.get('id') as string;
            return await deleteMaterial(id);
        }catch(e){
            console.error('Error deleting material:', e);
            return fail(500, { message: 'Failed to delete material' });
        }
    },

    submitObjects: async({request})=>{
        const data = await request.formData();
        const selectedObjects = data.getAll('selectedObjects') as string[];
        console.log(data);

        console.log('Selected object IDs:', selectedObjects);

        return {
            success: true,
            message: 'Objects submitted successfully'
        };
    }
};
