/** @type {import('./$types').PageLoad} */
import axios from 'axios';

export async function load() {
	try {
		// const organisationID = get(orgID);

		// if(organisationID === ''){
		// 	return{
		// 		workspaces: []
		// 	}
		// }

		const url = 'http://localhost:3000/workspaces/organisation/66782cb5370486e47cd2fe0b';

		const response = await axios.get(url);

		console.log('i am in load');

		console.log('This is the response form load ', response);

		// Handle the response data
		const res_data = response.data;

		if (res_data) {
			if (res_data.length === 0) {
				return {
					workspaces: []
				};
			} else {
				const wkspc = [];
				for (let i = 0; i < res_data.length; i++) {
					const new_work = {
						name: res_data[i].name,
						id: res_data[i]._id
					};
					wkspc.push(new_work);
				}
				return {
					workspaces: wkspc
				};
			}
		}
	} catch (error) {
		// Handle any errors
		console.error('Error making the GET request:', error);
	}

	return {
		workspaces: [
			{
				name: 'Computer Networks'
			},
			{
				name: 'Artificial Intelligence'
			},
			{
				name: 'Programming Languages'
			},
			{
				name: 'Computer Graphics'
			}
		]
	};
}
