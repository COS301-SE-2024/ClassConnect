import mongoose from '$lib/server/database/db';

const passwordResetTokenSchema = new mongoose.Schema({
	token_hash: {
		type: String,
		unique: true,
		required: true
	},
	user_id: {
		ref: 'User',
		required: true,
		type: mongoose.Types.ObjectId
	},
	expires_at: {
		type: Date,
		required: true
	}
});

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

export default PasswordResetToken;
