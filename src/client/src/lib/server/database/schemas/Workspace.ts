import mongoose from '$lib/server/database/db';

const workspaceSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	image: String,
	description: String,
	owner: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	},
	organisation: {
		type: mongoose.Types.ObjectId,
		ref: 'Organisation',
		required: true
	}
});

const Workspace = mongoose.models.Workspace || mongoose.model('Workspace', workspaceSchema);

export default Workspace;
