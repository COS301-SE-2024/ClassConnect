import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
	topic: {
		type: String,
		required: true
	},
	description: String,
	date: {
		type: Date,
		required: true
	},
	workspace_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Workspace',
		required: true
	}
});

const Lesson = mongoose.model('Schedule', lessonSchema);
