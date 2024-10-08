import type { InteractiveLesson, Notes, MCQ, LessonThreeDMaterial, Annotation } from '$src/types';
import InteractiveLessons from '$src/lib/server/database/schemas/InteractiveLesson';
import mongoose from 'mongoose';
import User from '$db/schemas/User';
import MCQs from '$db/schemas/MCQ';
import Note from '$db/schemas/Notes';
import Annotations from '$db/schemas/Annotations';
import ThreeDMaterial from '$db/schemas/ThreeDMaterial';
import Workspace from '$db/schemas/Workspace';
import Material from '$db/schemas/Material';

async function AddContentToLesson(lesson: any, content: any) {
	lesson.content.push(content._id);
	await lesson.save();
}

async function RemoveContentFromLesson(lesson: any, content: any) {
	const contentArray = lesson.content;
	const index = contentArray.indexOf(content._id);
	if (index > -1) {
		contentArray.splice(index, 1);
	}
	lesson.content = contentArray;
	await lesson.save();
}

async function searchById(id: mongoose.Types.ObjectId | string) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new Error('Invalid ID');
	}

	try {
		const [noteResult, mcqResult, threeDmaterialResult] = await Promise.all([
			Note.findById(id).exec(),
			MCQs.findById(id).exec(),
			ThreeDMaterial.findById(id).exec()
		]);

		if (noteResult) {
			return { type: 'Notes', data: noteResult };
		} else if (mcqResult) {
			return { type: 'MCQ', data: mcqResult };
		} else if (threeDmaterialResult) {
			return { type: 'ThreeDMaterial', data: threeDmaterialResult };
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error searching for document:', error);
		throw error;
	}
}

async function formatContent(
	id: mongoose.Types.ObjectId
): Promise<Partial<MCQ | Notes | LessonThreeDMaterial>> {
	const content = await searchById(id);
	if (content === null) {
		throw new Error('Invalid content');
	}
	if (content.type !== undefined && content.type === 'MCQ') {
		return {
			question: content.data.question,
			options: content.data.options,
			answer: content.data.answer,
			description: content.data.description,
			id: content.data._id.toString(),
			type: 'MCQ'
		};
	}
	if (content.type !== undefined && content.type === 'Notes') {
		return {
			title: content.data.title,
			content: content.data.content,
			id: content.data._id.toString(),
			type: 'Note'
		};
	}
	if (content.type !== undefined && content.type === 'ThreeDMaterial') {
		const materialID = content.data.material;
		const annotations = await Annotations.find({ material: materialID });
		let formatedAnnotations: Annotation[] = [];
		if (annotations !== null && annotations.length > 0) {
			formatedAnnotations = annotations.map((annotation: any) => {
				return {
					id: annotation._id.toString(),
					title: annotation.title,
					content: annotation.content,
					x: annotation.x,
					y: annotation.y,
					z: annotation.z
				};
			});
		}
		return {
			title: content.data.title,
			description: content.data.description,
			id: content.data._id.toString(),
			link: content.data.link,
			material: content.data.material.toString(),
			annotations: formatedAnnotations,
			type: 'ThreeDMaterial'
		};
	}
	throw new Error('Invalid content type');
}

async function FormatInteractiveLesson(lesson: any): Promise<Partial<InteractiveLesson>> {
	let formattedContent = [];
	if (Array.isArray(lesson.content) && lesson.content.length > 0) {
		formattedContent = await Promise.all(lesson.content.map(formatContent));
	}

	return {
		id: lesson._id.toString(),
		title: lesson.title,
		instructions: lesson.instructions,
		description: lesson.description,
		owner: lesson.owner.toString(),
		isAvailable: lesson.isAvailable,
		content: formattedContent
	};
}

export async function getInteractiveLessons(
	workspace_id: string
): Promise<Partial<InteractiveLesson>[]> {
	const lessons = await InteractiveLessons.find({ workspace_id });
	return await Promise.all(lessons.map(FormatInteractiveLesson));
}

export async function getInteractiveLesson(id: string): Promise<Partial<InteractiveLesson>> {
	const lesson = await InteractiveLessons.findById(id);
	if (lesson === null) {
		throw new Error('Invalid lesson');
	}
	return await FormatInteractiveLesson(lesson);
}

export async function createInteractiveLesson(
	workspace_id: string,
	lesson: InteractiveLesson
): Promise<void> {
	const user = await User.findById(lesson.owner);
	const workspace = await Workspace.findById(workspace_id);

	if (user === null) {
		throw new Error('Invalid user');
	}

	if (workspace === null) {
		throw new Error('Invalid workspace');
	}
	const newLesson = new InteractiveLessons({
		title: lesson.title,
		description: lesson.description,
		instructions: lesson.instructions,
		owner: user._id,
		isAvailable: lesson.isAvailable,
		workspace_id: workspace._id
	});

	await newLesson.save();
}

export async function deleteLesson(id: string): Promise<void> {
	await InteractiveLessons.findByIdAndDelete(id);
}

export async function editLesson(data: FormData) {
	const id = data.get('id') as string;
	const title = data.get('title') as string;
	const description = data.get('description') as string;
	const instructions = data.get('instructions') as string;

	const updateData: { [key: string]: string | boolean } = {};

	if (title !== '') updateData.title = title;
	if (description !== '') updateData.description = description;
	if (instructions !== '') updateData.instructions = instructions;

	await InteractiveLessons.findByIdAndUpdate(id, updateData);
}

export async function toggleavailability(id: string): Promise<void> {
	const lesson = await InteractiveLessons.findById(id);
	if (lesson === null) {
		throw new Error('Invalid lesson');
	}
	await InteractiveLessons.findByIdAndUpdate(id, { isAvailable: !lesson.isAvailable });
}

export async function createLessonNote(data: FormData) {
	const title = data.get('title') as string;
	const content = data.get('content') as string;
	const lesson_id = data.get('lesson') as string;

	const lessonData = await InteractiveLessons.findById(lesson_id);

	if (lessonData === null) {
		throw new Error('Invalid lesson');
	}

	const lesson = lessonData._id;

	const newNote = new Note({
		title,
		content,
		lesson
	});

	await newNote.save();
	await AddContentToLesson(lessonData, newNote);
}

export async function createMCQ(data: FormData) {
	const question = data.get('question') as string;
	const options = data.getAll('options') as string[];
	const answer = data.get('answer') as string;
	const description = data.get('description') as string;
	const lesson_id = data.get('lesson') as string;

	const lessonData = await InteractiveLessons.findById(lesson_id);

	if (lessonData === null) {
		throw new Error('Invalid lesson');
	}

	const lesson = lessonData._id;

	const newMCQ = new MCQs({
		question,
		options,
		answer,
		description,
		lesson
	});

	await newMCQ.save();

	await AddContentToLesson(lessonData, newMCQ);
}

export async function createThreeDNote(data: FormData) {
	const title = data.get('title') as string;
	const description = data.get('description') as string;
	const materialID = data.get('material') as string;
	const material = await Material.findById(materialID);
	const lessonID = data.get('lesson') as string;
	const lesson = await InteractiveLessons.findById(lessonID);

	if (material === null) {
		throw new Error('Invalid material');
	}

	if (lesson === null) {
		throw new Error('Invalid lesson');
	}

	const link = material.file_path;

	const newThreeDMaterial = new ThreeDMaterial({
		title: title,
		description: description,
		material: material._id,
		lesson: lesson._id,
		link
	});

	await newThreeDMaterial.save();

	await AddContentToLesson(lesson, newThreeDMaterial);
}

export async function changeThreeDNoteObject(contentID: string, materialID: string) {
	const content = await ThreeDMaterial.findById(contentID);
	const material = await Material.findById(materialID);

	if (content === null) {
		throw new Error('Invalid content');
	}

	if (material === null) {
		throw new Error('Invalid material');
	}

	await ThreeDMaterial.findByIdAndUpdate(contentID, {
		material: material._id,
		link: material.file_path
	});
}

export async function createAnnotation(data: FormData) {
	const materialID = data.get('material') as string;
	const title = data.get('title') as string;
	const content = data.get('content') as string;
	const x = data.get('x') as string;
	const y = data.get('y') as string;
	const z = data.get('z') as string;

	const material = await Material.findById(materialID);

	if (material === null) {
		throw new Error('Invalid material');
	}

	const newAnnotation = new Annotations({
		material: material._id,
		title,
		content,
		x,
		y,
		z
	});

	await newAnnotation.save();
}

export async function deleteAnnotation(annotationID: string) {
	const annotation = await Annotations.findById(annotationID);
	if (annotation === null) {
		throw new Error('Invalid annotation');
	}
	const id = annotation._id;
	await Annotations.findByIdAndDelete(id);
}

export async function editAnnotation(data: FormData) {
	const annotationID = data.get('id') as string;
	const annotation = await Annotations.findById(annotationID);
	const title = data.get('title') as string;
	const content = data.get('content') as string;
	if (annotation === null) {
		throw new Error('Invalid annotation');
	}
	const id = annotation._id;
	await Annotations.findByIdAndUpdate(id, { title, content });
}

export async function answerMCQ(id: string, answer: string) {
	const mcq = await MCQs.findById(id);
	if (mcq === null) {
		throw new Error('Invalid MCQ');
	}
	if (mcq.answer === answer) {
		return true;
	} else {
		return false;
	}
}

export async function deleteContent(data: FormData) {
	const id = data.get('id') as string;
	const lesson_id = data.get('lesson') as string;

	const lessonData = await InteractiveLessons.findById(lesson_id);
	const content = await searchById(id);

	if (content === null) {
		throw new Error('Invalid content');
	}

	if (content.type === 'Notes') {
		await Note.findByIdAndDelete(id);
	}
	if (content.type === 'MCQ') {
		await MCQs.findByIdAndDelete(id);
	}
	if (content.type === 'ThreeDMaterial') {
		await ThreeDMaterial.findByIdAndDelete(id);
	}

	await RemoveContentFromLesson(lessonData, content.data);
}

export async function editContent(data: FormData) {
	const id = data.get('id') as string;
	const question = data.get('question') as string;
	const options = data.getAll('options') as string[];
	const answer = data.get('answer') as string;
	const description = data.get('description') as string;
	const title = data.get('title') as string;
	const content = data.get('content') as string;

	const contentData = await searchById(id);

	if (contentData === null) {
		throw new Error('Invalid content');
	}

	if (contentData.type === 'Notes') {
		await Note.findByIdAndUpdate(id, { title, content });
	}
	if (contentData.type === 'MCQ') {
		await MCQs.findByIdAndUpdate(id, { question, options, answer, description });
	}
	if (contentData.type === 'ThreeDMaterial') {
		await ThreeDMaterial.findByIdAndUpdate(id, { title, description });
	}
}
