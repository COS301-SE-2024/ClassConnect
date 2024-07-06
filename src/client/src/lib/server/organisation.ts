import mongoose from '$lib/server/database/db';
import type { Org } from '$lib/store/types';
import Workspace from '$db/schemas/Workspace';
import Lesson from '$db/schemas/Lesson';
import Material from '$db/schemas/Material';
import Organisation from '$db/schemas/Organisation';
import User from '$db/schemas/Organisation';

export async function getOrganisationDetails(orgID: any): Promise<Org> {
	const org = await Organisation.findById(orgID);

	if (org === null) {
		throw new Error('Organisation not found');
	} else {
		return {
			id: org._id.toString(),
			org_name: org.name,
			image: org.image ?? ''
		};
	}
}

export async function propagateOrgDelete(orgID: any, createdBy: any): Promise<void> {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// Step 1: Delete the organization
		await Organisation.findByIdAndDelete(orgID).session(session);

		// Step 2: Remove the organization reference from the user who created it
		await User.findByIdAndUpdate(createdBy, { organisation: '' }).session(session);

		// Step 3: Delete other users associated with the organization, excluding the creator
		await User.deleteMany({ organisation: orgID, _id: { $ne: createdBy } }).session(session);

		// Step 4: Find and delete workspaces associated with the organization
		const workspaces = await Workspace.find({ organisation: orgID }).session(session);
		const workspaceIds = workspaces.map((workspace) => workspace._id);

		await Workspace.deleteMany({ organisation: orgID }).session(session);

		// Step 5: Delete lessons and materials associated with the workspaces of the organization
		await Lesson.deleteMany({ workspace_id: { $in: workspaceIds } }).session(session);
		await Material.deleteMany({ workspace_id: { $in: workspaceIds } }).session(session);

		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
}
