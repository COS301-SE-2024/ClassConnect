
import type { Actions, PageServerLoad } from './$types';
import { fail, error } from '@sveltejs/kit';
import mongoose from 'mongoose';
import Question from '$lib/server/database/schemas/Question';
import Quiz from '$lib/server/database/schemas/Quiz';

export const load: PageServerLoad = async ({ params }) => {
	try {
	  const quizId = params.quiz; 
	  const questions = await Question.find({ quizId});
  
	  return {
		questions: questions.map((q) => ({
		  id: q._id.toString(),
		  questionNumber: q.questionNumber,
		  questionContent: q.questionContent,
		  questionType: q.questionType,
		  options: q.options,
		})),
	  };
	} catch (e) {
	  console.error('Failed to load Questions: ', e);
	  throw error(500, 'Error occurred while fetching Questions');
	}
  };


function validateLecturer(locals: any) {
	if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorised');
}
