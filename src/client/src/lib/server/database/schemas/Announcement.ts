import mongoose from '$lib/server/database/db';

const announcementsSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now
	},
	owner: {
		type: mongoose.Types.ObjectId,
		ref: 'Organisation' || 'Workspace',
		required: true
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

const Announcement =
	mongoose.models.Announcement || mongoose.model('Announcement', announcementsSchema);

export default Announcement;
