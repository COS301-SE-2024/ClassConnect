import axios from 'axios';

export async function materials(type: boolean, workspace_id: string, lecturer_id: string, title: string, description: string, file_path: string) {
    try {
        const response = await axios.post('http://localhost:3000/student/module/study/material', {
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