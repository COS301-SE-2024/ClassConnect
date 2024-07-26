
import type { Actions, PageServerLoad } from './$types';
import { fail, error } from '@sveltejs/kit';
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import type { Question } from '$src/types';
import Questions from '$db/schemas/Announcement';

export const load: PageServerLoad = async ({ params }) => {
	try {
	  const quizId = params.quiz; 
	  const questions = await Questions.find({ quizId});
  
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

//lecture validation
function validateLecturer(locals: any) {
	if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorised');
}

//Question creation
async function createQuestion(
	questionNumber: number,
	questionContent: string,
	questionType: string,
	options: { content: string, points: number }[],
	quizId: ObjectId | undefined
  ) {
	const newQuestion = new Questions({
	  questionNumber,
	  questionContent,
	  questionType,
	  options,
	  quiz: quizId
	});
  }

//actions
export const actions: Actions = {
	post: async ({ request, locals, params }) => {
	  validateLecturer(locals);
  
	  try {
		const data = await request.formData();
		const questionNumber = parseInt(data.get('questionNumber') as string, 10);
		const questionContent = data.get('questionContent') as string;
		const questionType = data.get('questionType') as string;
		const options = JSON.parse(data.get('options') as string);
		const quizId = new mongoose.Types.ObjectId(params.quiz);
  
		return await createQuestion(questionNumber, questionContent, questionType, options, quizId);
	  } catch (error) {
		console.error('Error creating question:', error);
		return fail(500, { error: 'Failed to create question' });
	  }
	}
  };