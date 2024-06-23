import axios from 'axios';

//create Schedule
//POST req
export async function schedules(
	topic: string,
	userID: string,
	workspaceID: string,
	date: string
): Promise<any> {
	try {
		const response = await axios.post('http://localhost:3000/schedules', {
			topic: topic,
			lecture_id: userID,
			workspace_id: workspaceID,
			date: date
		});

		return response.data;
	} catch (error) {
		throw new Error('Schedule lesson failed', error);
	}
}
