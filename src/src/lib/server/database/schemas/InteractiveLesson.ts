import mongoose from '$lib/server/database/db';

const InteractiveLessonSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	instructions: {
		type: String,
		required: true
	},
	owner: {
		type: mongoose.Types.ObjectId,
		ref: 'Workspace',
		required: true
	},
	isAvailable: {
		type: Boolean,
		default: false
	},
	content: {
		type: [mongoose.Types.ObjectId],
		ref: 'Notes' || 'MCQ' || 'ThreeDMaterial',
		required: false
	},
	workspace_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Workspace',
		required: true
	}
});

const InteractiveLesson =
	mongoose.models.InteractiveLessonSchema ||
	mongoose.model('InteractiveLesson', InteractiveLessonSchema);

export default InteractiveLesson;
