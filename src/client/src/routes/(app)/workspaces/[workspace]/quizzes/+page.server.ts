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