import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	type: {
		type: Boolean,
		required: true
	},
	file_path: {
		type: String,
		required: true
	},
	workspace_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Workspace',
		required: true
	}
});

const Material = mongoose.model('Material', materialSchema);

export default Material;
