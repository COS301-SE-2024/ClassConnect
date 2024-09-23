import mongoose from '$lib/server/database/db';

const optionSchema = new mongoose.Schema({
	content: { type: String, required: true },
	points: { type: Number, required: true },
	_id: { type: mongoose.Types.ObjectId }
});

const questionSchema = new mongoose.Schema({
	questionNumber: {
		type: Number,
		required: true
	},

	questionContent: {
		type: String,
		required: true
	},

	questionType: {
		type: String,
		required: true
	},

	questionPoints: {
		type: Number,
		required: false
	},

	correctAnswer:{
		type: String,
		required: false
	},

	options: {
		type: [optionSchema],
		required: false
	},

	quiz: {
		type: mongoose.Types.ObjectId,
		ref: 'Quiz',
		required: true
	}
});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question;
