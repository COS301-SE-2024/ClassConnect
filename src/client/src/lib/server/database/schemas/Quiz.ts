import mongoose from '$lib/server/database/db';

const quizsSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	instructions: {
		type: String,
		required: true
	},
	graded: {
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
	duration: {
		type: Number,
		required: true
	}
});

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizsSchema);

export default Quiz;
