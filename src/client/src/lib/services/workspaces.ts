import axios from 'axios';

// create workspace POST
export async function workspaces(name: string, organisationID: string, createdBy: string, users: string[], image: string): Promise<any> {
    try {
        const response = await axios.post('http://localhost:3000/workspaces', {
            name: name,
            organisationID: organisationID,
            createdBy: createdBy,
            users: users,
            image: image
        });

        return response.data;
    } catch (error) {
        throw new Error('Create Workspace Failed');
    }
}

// get Workspace GET
export async function getWorkspace(id: string): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3000/workspaces/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Get Workspace Failed');
    }
}