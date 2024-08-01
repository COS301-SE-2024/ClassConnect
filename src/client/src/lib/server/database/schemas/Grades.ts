import mongoose from '$lib/server/database/db';

const gradesSchema = new mongoose.Schema({
	studentID: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	},
	quizID: {
		type: mongoose.Types.ObjectId,
		ref: 'Quiz',
		required: true
	},
	workspaceID: {
		type: mongoose.Types.ObjectId,
		ref: 'Workspace',
		required: true
	},
	mark: {
		type: Number,
		required: true
	}
});

const Grades = mongoose.models.Grades || mongoose.model('Grades', gradesSchema);

export default Grades;
