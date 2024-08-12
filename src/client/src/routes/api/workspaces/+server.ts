import { json } from '@sveltejs/kit';
import Workspace from '$db/schemas/Workspace';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
	// Check if user is not authenticated
	if (locals.user) {
		// Extract the workID from query parameters
		const workID = url.searchParams.get('workID');

		if (workID) {
			try {
				// Find workspace by ID
				const work = await Workspace.findById(workID);

				// Check if workspace exists
				if (!work) {
					return json({ error: 'Workspace not found' }, { status: 404 });
				}

				// Prepare and return the workspace data
				const workspace = {
					name: work.name,
					id: work._id.toString()
				};
				return json(workspace);
			} catch (err) {
				console.error('Error fetching workspace:', err);
				return json({ error: 'Internal Server Error' }, { status: 500 });
			}
		} else {
			return json({ error: 'Missing workID parameter' }, { status: 400 });
		}
	} else {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
}
