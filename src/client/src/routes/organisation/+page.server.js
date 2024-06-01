/** @type {import('./$types').Actions} */

// Mock edit details function
async function editDetails(org_name, image_file, orgID) {
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

async function createOrg(org_name, image_file) {
	if (org_name) {
		console.log(org_name);
	}
	if (image_file) {
		console.log(image_file.name);
	}

	return {
		organisationID: '12345678910'
	};
}

async function getOrgDetails(orgId) {
	console.log(orgId);
	return {
		organisationName: 'University Of Pretoria',
		organisationImage: 'https://www.up.ac.za/'
	};
}

async function removeOrg(orgId) {
	console.log(orgId);
}

export const actions = {
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
			success: true,
			body: {
				newOrgName: orgName
			}
		});
	},
	create: async ({ request }) => {
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

		const res = await createOrg(orgName, imageFile);

		console.log(res);

		return JSON.stringify({
			success: true,
			body: {
				organisationID: res.organisationID
			}
		});
	},
	getOrganisationDetails: async ({ request }) => {
		const { body } = request;
		if (body) {
			const formData = await request.formData();
			const orgId = formData.get('organisationID');

			if (orgId) {
				const details = await getOrgDetails(orgId);
				return JSON.stringify({
					success: true,
					body: {
						organisationName: details.organisationName,
						organisationImage: details.organisationImage
					}
				});
			}
		}
	},
	remove: async ({ request }) => {
		const { body } = request;
		if (body) {
			const formData = await request.formData();
			const orgId = formData.get('organisationID');

			if (orgId) {
				await removeOrg(orgId);
				return JSON.stringify({
					success: true
				});
			}
		}
	}
};
