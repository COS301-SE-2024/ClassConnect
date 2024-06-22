import axios from 'axios';

export async function materials(type: boolean, workspace_id: string, lecturer_id: string, title: string, description: string, file_path: string) {
    try {
        const response = await axios.post('http://localhost:3000/materials', {
            type: type,
            workspace_id: workspace_id,
            lecturer_id: lecturer_id,
            title: title,
            description: description,
            file_path: file_path
        });

        return response.data;
    } catch (error) {
        throw new Error('Create Material Failed');
    }
}

export async function getMaterial(id: string ): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3000/materials/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Get Material Failed');
    }
}

export async function updateWorkspace(
    id: string,
    name: string,
    organisationID: string,
    users: string[],
    image: string
): Promise<any> {
    try {
        const response = await axios.put(`http://localhost:3000/materials/${id}`, {
            name: name,
            organisationID: organisationID,
            users: users,
            image: image
        });
        return response.data;
    } catch (error) {
        throw new Error('Update Material Failed');
    }
}

export async function deleteMaterial(id: string): Promise<string> {
    try {
        const response = await axios.delete(`http://localhost:3000/materials/${id}`);
        return response.data.message;
    } catch (error) {
        throw new Error('Delete Material Failed');
    }
}