import mongoose from '$lib/server/database/db';

const organisationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		image: String,
		createdBy: {
			ref: 'User',
			required: true,
			type: mongoose.Types.ObjectId
		}
	},
	{ timestamps: true }
);

const Organisation =
	mongoose.models.Organisation || mongoose.model('Organisation', organisationSchema);

export default Organisation;
