import mongoose from '$lib/server/database/db';

const announcementsSchema = new mongoose.Schema({
	topic: {
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

	id: {
		type: mongoose.Types.ObjectId,
		ref: 'Workspace' || 'Organisation', 
		required: true
	}

});

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementsSchema);

export default Announcement;