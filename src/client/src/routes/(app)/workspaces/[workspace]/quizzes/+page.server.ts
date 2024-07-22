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
	ownerID: ObjectId | undefined
) {
	const newQuiz = new Quizzes({
		title,
		graded,
		owner: ownerID
	});

	await newQuiz.save();

	return { success: true };
}
// import { error, redirect } from '@sveltejs/kit';

// export async function load({ locals }) {
// 	if (!locals.user) return redirect(302, '/signin');
// 	if (locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');
// }
