import mongoose from 'mongoose';

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
	organisation: {
		type: mongoose.Types.ObjectId,
		ref: 'Organisation',
		default: ''
	},
	workspaces: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'Workspace'
		}
	]
});

const User = mongoose.model('User', userSchema);

export default User;
