// Notes.ts
import mongoose from 'mongoose';

const NotesSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	lesson: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'InteractiveLesson',
		required: true
	}
});

const Notes = mongoose.models.NotesSchema || mongoose.model('Notes', NotesSchema);

export default Notes;
