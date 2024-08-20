//quizzes.page.server.ts

import type { Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
//import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
//import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import type { Quiz } from '$src/types';
import Quizzes from '$db/schemas/Quiz';
import Activities from '$db/schemas/Activity';

function formatQuiz(quiz: any): Quiz {
	return {
		title: quiz.title,
		instructions: quiz.instructions,
		id: quiz._id.toString(),
		graded: quiz.graded,
		date: quiz.date.toISOString(),
		duration: quiz.duration,
		isAvailable: quiz.isAvailable
	};
}

async function getQuizzes(ownerID: string | undefined): Promise<Quiz[]> {
	const quizzes = await Quizzes.find({ owner: ownerID });
	return quizzes.map(formatQuiz);
}

export async function load({ params }) {
	try {
		const workspaceID = params.workspace;
		const quizzes = await getQuizzes(params.workspace);
		//console.log('Workspace: ', params.workspace);

		return {
			workspaceID,
			quizzes
		};
	} catch (e) {
		console.error('Failed to load Quizzes: ', e);
		throw error(500, 'Error occurred while fetching Quizzes');
	}
}

async function updateQuizAvailability(quizId: string, isAvailable: boolean) {
	try {
		const quiz = await Quizzes.findById(quizId);
		if (!quiz) {
			return fail(404, { error: 'Quiz not found' });
		}

		quiz.isAvailable = isAvailable;
		console.log(quiz.isAvailable);
		await quiz.save();

		return { success: true };
	} catch (err) {
		console.error('Error updating quiz availability:', err);
		return fail(500, { error: 'Failed to update quiz availability' });
	}
}

async function createQuiz(
	title: string,
	graded: string,
	instructions: string,
	ownerID: ObjectId,
	duration: number
) {
	const newQuiz = new Quizzes({
		title,
		graded,
		instructions,
		owner: ownerID,
		duration
	});

	await newQuiz.save();

	const newActivity = new Activities({
		title: `New Quiz: ${title}`,
		description: instructions || '',
		date: new Date(),
		owner: ownerID,
		type: 'quiz'
	});

	await newActivity.save();
	return { success: true };
}

function validateLecturer(locals: any) {
	if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorised');
}

async function deleteQuiz(id: string) {
	const deletedQuiz = await Quizzes.findByIdAndDelete(id);
	if (!deletedQuiz) throw new Error('Quiz not found');

	return { success: true };
}

export const actions: Actions = {
	post: async ({ request, locals, params }) => {
		validateLecturer(locals);

		try {
			const data = await request.formData();
			const title = data.get('title') as string;
			const durationInMinutes = parseInt(data.get('duration') as string, 10);
			const duration = durationInMinutes * 60 * 1000;
			const instructions = data.get('instructions') as string;
			const graded = 'No';
			const workspaceId = new mongoose.Types.ObjectId(params.workspace);
			console.log('Quiz Workspace Id:', workspaceId);

			const result = await createQuiz(title, graded, instructions, workspaceId, duration);
			return result;
		} catch (error) {
			console.error('Error posting quiz:', error);
			return fail(500, { error: 'Failed to post quiz' });
		}
	},

	delete: async ({ request, locals }) => {
		validateLecturer(locals);

		try {
			const data = await request.formData();
			const id = data.get('id') as string;
			if (!id) return fail(400, { error: 'Quiz ID is required' });

			return await deleteQuiz(id);
		} catch (err) {
			console.error('Error removing quiz:', err);
			return fail(500, { error: 'Failed to remove quiz' });
		}
	},

	toggleAvailability: async ({ request }) => {
		try {
			const data = await request.formData();
			const quizId = data.get('quizId') as string;
			const isAvailable = data.get('isAvailable') === 'true';

			if (!quizId) return fail(400, { error: 'Quiz ID is required' });

			return await updateQuizAvailability(quizId, isAvailable);
		} catch (err) {
			console.error('Error toggling quiz availability:', err);
			return fail(500, { error: 'Failed to toggle quiz availability' });
		}
	}
};
