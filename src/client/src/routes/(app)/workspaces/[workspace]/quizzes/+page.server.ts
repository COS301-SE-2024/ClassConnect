import type { Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
//import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
//import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import type { Quiz } from '$src/types';
import Quizzes from '$db/schemas/Quiz';

function formatQuiz(quiz: any): Quiz {
	return {
		title: quiz.title,
		instructions: quiz.instructions,
		id: quiz._id.toString(),
		graded: quiz.graded,
		date: quiz.date.toISOString(),
	};
}

async function getQuizzes(ownerID: string | undefined): Promise<Quiz[]> {
	const quizzes = await Quizzes.find({ owner: ownerID });
	return quizzes.map(formatQuiz);
}

export async function load({ params }) {
	try {
		const quizzes = await getQuizzes(params.workspace);
		console.log('Workspace: ', params.workspace);

		return {
			quizzes
		};
	} catch (e) {
		console.error('Failed to load Quizzes: ', e);
		throw error(500, 'Error occurred while fetching Quizzes');
	}
}

async function createQuiz(
	title: string,
	graded: string,
	instructions: string,
	ownerID: ObjectId | undefined
) {
	const newQuiz = new Quizzes({
		title,
		graded,
		instructions,
		owner: ownerID
	});

	await newQuiz.save();

	return { success: true };
}

function validateLecturer(locals: any) {
	if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorised');
}


export const actions: Actions = {
	post: async ({ request, locals, params }) => {
		validateLecturer(locals);

		try {
			const data = await request.formData();
			const title = data.get('title') as string;
			const instructions = data.get('instructions') as string;
			const graded = 'No';
			const workspaceId = new mongoose.Types.ObjectId(params.workspace);

			return await createQuiz(title, graded, instructions, workspaceId);
		} catch (error) {
			console.error('Error posting quiz:', error);
			return fail(500, { error: 'Failed to post quiz' });
		}
	}
}
// import { error, redirect } from '@sveltejs/kit';

// export async function load({ locals }) {
// 	if (!locals.user) return redirect(302, '/signin');
// 	if (locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');
// }
