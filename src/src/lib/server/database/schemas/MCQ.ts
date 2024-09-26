import mongoose from 'mongoose';

const MCQSchema = new mongoose.Schema({
	question: {
		type: String,
		required: true
	},
	options: {
		type: [String],
		required: true
	},
	answer: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	lesson: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'InteractiveLesson',
		required: true
	}
});

const MCQ = mongoose.models.MCQSchema || mongoose.model('MCQ', MCQSchema);

export default MCQ;
