import mongoose from '$lib/server/database/db';

const announcementsSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},

	description:{
        type: String,
        required: true
    },

	date: {
		type: Date,
		required: true
	},

    type: {
        type: String,
        required: true
    },

	ID: {
		type: mongoose.Types.ObjectId,
		ref: 'Workspace' || 'Organisation', 
		required: true
	},

	createdBy:{
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	}

});

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementsSchema);

export default Announcement;