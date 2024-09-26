// ThreeDMaterial.ts
import mongoose from 'mongoose';

const ThreeDMaterialSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	material: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Material',
		required: true
	},
	lesson: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'InteractiveLesson',
		required: true
	},
	link: {
		type: String,
		required: true
	}
});

const ThreeDMaterial =
	mongoose.models.ThreeDMaterialSchema || mongoose.model('ThreeDMaterial', ThreeDMaterialSchema);

export default ThreeDMaterial;
