import mongoose from '$lib/server/database/db';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	image: String,
	role: {
		type: String,
		required: true,
		enum: ['admin', 'lecturer', 'student']
	},
	custom_password: {
		type: Boolean,
		default: false
	},
	organisation: {
		type: mongoose.Types.ObjectId,
		ref: 'Organisation'
	},
	workspaces: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'Workspace'
		}
	]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
