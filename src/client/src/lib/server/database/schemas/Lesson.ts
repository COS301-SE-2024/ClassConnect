import mongoose from '$lib/server/database/db';

const lessonSchema = new mongoose.Schema({
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
	}
});

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);

export default Lesson;
