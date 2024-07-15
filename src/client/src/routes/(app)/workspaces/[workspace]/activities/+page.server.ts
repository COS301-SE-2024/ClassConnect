import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import Activity from '$db/schemas/Activity';

function formatActivities(activity: any): Activity {
	return {
			id: activity._id.toString(),
			title: activity.title,
			description: activity.description,
			date: activity.date,
			type: activity.type
	};
}

async function getActivity(ownerID: string| undefined): Promise<Activity[]> {
	const activities = await Activity.find({owner: ownerID}).sort({ date: -1 }).lean();
	return activities.map(formatActivities);
}

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) return redirect(302, '/signin');
	if (locals.user.role !== 'student') throw error(401, 'Unauthorized');
	const workspaceID = params.workspace;

	try {
		const activities = await Activity.getActivity(workspaceID);

		return {
				activities
				
			};
	} catch (error) {
		console.error('Failed to load activities:', error);
		throw new Error('Failed to load activities');
	}
};