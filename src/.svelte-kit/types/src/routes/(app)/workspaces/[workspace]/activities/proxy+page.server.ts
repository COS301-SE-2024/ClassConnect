// @ts-nocheck
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Activity } from '$src/types';
import Activities from '$db/schemas/Activity';

function formatActivities(activity: any): Activity {
	return {
		id: activity._id.toString(),
		title: activity.title,
		description: activity.description,
		date: activity.date,
		type: activity.type
	};
}

async function getActivity(ownerID: string | undefined): Promise<Activity[]> {
	const activities = await Activities.find({ owner: ownerID }).sort({ date: -1 }).lean();
	return activities.map(formatActivities);
}

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
	if (!locals.user) return redirect(302, '/signin');
	if (locals.user.role !== 'student') throw error(401, 'Unauthorized');
	//const workspaceID = params.workspace;

	try {
		const activities = await getActivity(params.workspace);

		return {
			activities
		};
	} catch (error) {
		console.error('Failed to load activities:', error);
		throw new Error('Failed to load activities');
	}
};
