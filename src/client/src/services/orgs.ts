import axios from 'axios';

//create org POST
export async function organizations(org_name: string, userID: string, image: string): Promise<any> {
	try {
		const response = await axios.post('http://localhost:3000/organisations', {
			name: org_name,
            createdBy: userID,
            image: image
		});

		return response.data;
	} catch (error) {
		throw new Error('Create Org  failed');
	}
}

//updatte org PUT()
export async function updateOrganization(id: string, org_name: string, image: string): Promise<any> {
    try {
        const response = await axios.put(`http://localhost:3000/organisations/${id}`, {
            name: org_name,
            image: image
        });
        return response.data;
    } catch (error) {
        throw new Error('Update Org failed');
    }
}


//get org GET
export async function getOrganization(id: string): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3000/organisations/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Get Org failed');
    }
}



//delete org DELETE
export async function deleteOrganization(id: string): Promise<string> {
    try {
        const response = await axios.delete(`http://localhost:3000/organizations/${id}`);
        return response.data.message; 
    } catch (error) {
        throw new Error('Delete Org failed'); 
    }

}