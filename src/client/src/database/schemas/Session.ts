import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true
		},
		user_id: {
			type: String,
			required: true
		},
		expires_at: {
			type: Date,
			required: true
		}
	},
	{ _id: false }
);

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session;
