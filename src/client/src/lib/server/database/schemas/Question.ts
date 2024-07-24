import mongoose from '$lib/server/database/db';

const optionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  points: { type: Number, required: true },
});

const questionSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  questionContent: { type: String, required: true },
  questionType: { type: String, enum: ['multiple choice', 'true/false', 'short answer'], required: true },
  options: [optionSchema],
  quiz: { type: mongoose.Types.ObjectId, ref: 'Quiz', required: true },
});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question;
