
import type { Actions, PageServerLoad } from './$types';
import { fail, error } from '@sveltejs/kit';
import mongoose from 'mongoose';
import Question from '$lib/server/database/schemas/Question';
import Quiz from '$lib/server/database/schemas/Quiz';

export const load: PageServerLoad = async ({ params }) => {
	try {
	  const quizId = params.quizId; 
	  const questions = await Question.find({ quiz: quizId });
  
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