/** @type {import('./$types').Actions} */
import Organisation from '$db/schemas/Organisation';
import User from '$db/schemas/User';
import type { Org } from '$lib/store/types';

async function createOrg(org_name : any, userID : any) : Promise<Org> {

	//create new organisation
	const newOrg = new Organisation({
		name: org_name,
		createdBy: userID
	});

	// Save the new organisation
	await newOrg.save();

	// Add the user to the new Org
	await User.findByIdAndUpdate(userID, { organisation: newOrg._id });

	const ret_org : Org = {
		id: newOrg._id.toString(),
		org_name: newOrg.name,
		image: newOrg.image ?? ''
	};

	return ret_org;
}

async function editDetails(org_name : any, image_file : any, orgID : any) {
	if (org_name) {
		console.log(org_name);
	}

	if (image_file) {
		console.log(image_file.name);
	}

	if (orgID) {
		console.log(orgID);
	}
}

async function removeOrg(orgId : any) {
	console.log(orgId);
}

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const orgName = formData.get('org_name');
		const userID = formData.get('userID');

		console.log('Organisation Name: ', orgName);
		console.log('createdBy', userID);

		const new_org : Org = await createOrg(orgName, userID);

		console.log(new_org)

		return JSON.stringify(new_org);
	},
	edit: async ({ request }) => {
		const formData = await request.formData();
		const orgName = formData.get('org_name');
		const imageFile = formData.get('image');
		const OrgId = formData.get('orgID');

		console.log('Organisation Name: ', orgName);

		if (imageFile instanceof File) {
			console.log('Received file');
			console.log('File name: ', imageFile.name);
			console.log('File type: ', imageFile.type);
			console.log('File size: ', imageFile.size);
		} else {
			console.log('No file received');
		}

		await editDetails(orgName, imageFile, OrgId);

		return JSON.stringify({
			success: true
		});
	},
	remove: async ({ request }) => {
        const formData = await request.formData();
        const orgId = formData.get('organisationID');
        
        await removeOrg(orgId);
        
        return JSON.stringify({
            success: true
        });
	}
};
