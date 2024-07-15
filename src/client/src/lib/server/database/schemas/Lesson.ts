import mongoose from '$lib/server/database/db';
import type { Activity } from '$src/types';

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

lessonSchema.pre('save', async function(next) {
	try {
		const lesson = this;
		
		const activity = new Activity({
			title: `New Lesson: ${lesson.title}`,
			description: lesson.description,
			date: lesson.date,
			owner: lesson.workspace,
			type: 'lesson'
		});

		
		await activity.save();

		next();
	} catch (error) {
		next(error);
	}
});
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);

export default Lesson;
