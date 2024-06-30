import mongoose from '$lib/server/database/db';

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

const Lesson = mongoose.models.Lesson || mongoose.model('Schedule', lessonSchema);

export default Lesson;
