/** @type {import('./$types').Actions} */
import Organisation from '$db/schemas/Organisation';
import { propagateOrgDelete } from '$lib/server/organisation';
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

async function editDetails(org_name : any, orgID : any) : Promise<Org> {
	const org = await Organisation.findById(orgID);

	if (org === null) {
		throw new Error('Organisation not found');
	} else {
		org.name = org_name;
		await org.save();

		return {
			id: org._id.toString(),
			org_name: org.name,
			image: org.image ?? ''
		};
	}
}

async function removeOrg(orgId : any) : Promise<Org>  {
	const org = await Organisation.findById(orgId);

	if (org === null) {
		throw new Error('Organisation not found');
	} else {
		
		await propagateOrgDelete(orgId, org.createdBy);

		return {
			id: '',
			org_name: '',
			image: ''
		};
	}
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
		const OrgId = formData.get('orgID');

		console.log('Organisation Name: ', orgName);
		console.log('Organisation ID: ', OrgId);

		const new_org : Org = await editDetails(orgName, OrgId);

		return JSON.stringify(new_org);
	},
	remove: async ({ request }) => {
        const formData = await request.formData();
        const orgId = formData.get('organisationID');
        
        const new_org : Org = await removeOrg(orgId);
        
        return JSON.stringify(new_org);
	}
};
