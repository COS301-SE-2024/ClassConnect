import { error } from '@sveltejs/kit';
import Workspace from '$db/schemas/Workspace';

function validateUserCustom(locals: any, requiredRole: string) {
	if (!locals.user || locals.user.role !== requiredRole) {
		return false;
	} else {
		return true;
	}
}

export async function load({ locals, params }) {
	if ((validateUserCustom(locals, 'lecturer') || validateUserCustom(locals, 'student')) === false) {
		throw error(401, 'Unauthorised');
	}

	try {
		const workspaceId = params.workspace;

		const workspace = await Workspace.findOne({
			organisation: locals.user?.organisation,
			_id: workspaceId
		}).select('name');

		if (!workspace) {
			return { success: false, message: 'Workspace not found' };
		}

		const acceptableNames = ['Mining', 'Mining Engineering', 'Minning'];

		const nameMatches = acceptableNames.some(
			(name) => name.toLowerCase() === workspace.name.toLowerCase()
		);

		if (nameMatches) {
			return { success: true };
		} else {
			return { success: false };
		}
	} catch (e) {
		console.error('Failed to verify workspace:', e);
		throw error(500, 'Error occurred while verifying workspace');
	}
}
