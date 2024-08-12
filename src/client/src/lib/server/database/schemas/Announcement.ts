import mongoose from '$lib/server/database/db';

const announcementsSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now
	},
	owner: {
		required: true,
		type: mongoose.Types.ObjectId,
		ref: 'Organisation' || 'Workspace'
	},
	createdBy: {
		ref: 'User',
		required: true,
		type: mongoose.Types.ObjectId
	}
});

const Announcement =
	mongoose.models.Announcement || mongoose.model('Announcement', announcementsSchema);

export default Announcement;
