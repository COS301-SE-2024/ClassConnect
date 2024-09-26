// Annotations.ts
import mongoose from 'mongoose';

const AnnotationsSchema = new mongoose.Schema({
	material: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'Material'
	},
	x: {
		type: Number,
		required: true
	},
	y: {
		type: Number,
		required: true
	},
	z: {
		type: Number,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
});

const Annotations =
	mongoose.models.AnnotationsSchema || mongoose.model('Annotations', AnnotationsSchema);

export default Annotations;
