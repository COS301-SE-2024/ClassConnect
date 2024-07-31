import mongoose from '$lib/server/database/db';

const activitySchema = new mongoose.Schema({
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
		ref: 'Workspace',
		required: true
	},
	type: {
		type: String,
		required: true
	}
});

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;
