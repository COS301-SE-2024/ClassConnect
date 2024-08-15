import mongoose from '$lib/server/database/db';

const recordingSchema = new mongoose.Schema({
	topic: {
		type: String,
		required: true
	},
	description: String,
	time: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	workspace: {
		type: mongoose.Types.ObjectId,
		ref: 'Workspace',
		required: true
	},
	url: {
		type: String,
		required: true
	}
});

const Recording = mongoose.models.Recording || mongoose.model('Recording', recordingSchema);

export default Recording;
