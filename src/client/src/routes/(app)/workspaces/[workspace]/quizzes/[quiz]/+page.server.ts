
import type { Actions, PageServerLoad } from './$types';
import { fail, error } from '@sveltejs/kit';
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import type { Question } from '$src/types';
import Questions from '$db/schemas/Question';

export const load: PageServerLoad = async ({ params,locals }) => {
	try {
	  const role=locals.user?.role;
	  const quizId = params.quiz; 
	  const questions = await Questions.find({ quiz: quizId});
		//console.log('questions arr', questions);
	  return {
		questions: questions.map((q) => ({
		  id: q._id.toString(),
		  questionNumber: q.questionNumber,
		  questionContent: q.questionContent,
		  questionType: q.questionType,
		  quiz:q.quiz.toString(),
		  options: q.options.map((option: { content: any; points: any;  }) => ({
			content: option.content,
			points: option.points
			
		  }))
		})),
		role
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
	//console.log(newQuestion);
	await newQuestion.save();
	return {success:true};
  }

//actions
export const actions: Actions = {
	post: async ({ request, locals, params }) => {
	  validateLecturer(locals);
	  try {
		const data = await request.formData();
		const questionNumber = parseInt(data.get('questionNumber') as string, 10);
		const questionContent = data.get('questionContent') as string;
		const questionType = 'multiple-choice';
		
		const options = [];
		for (let i = 0; i < 3; i++) {  // We know there are 3 options
		  const optionContent = data.get(`options[${i}].content`);
		  const optionPoints = data.get(`options[${i}].points`);
		  if (optionContent && optionPoints) {
			options.push({
			  content: optionContent as string,
			  points: parseInt(optionPoints as string, 10)
			});
		  }
		}
  
		const quizId = new mongoose.Types.ObjectId(params.quiz);
		return await createQuestion(questionNumber, questionContent, questionType, options, quizId);
	  } catch (error) {
		console.error('Error creating question:', error);
		return fail(500, { error: 'Failed to create question' });
	  }
	}
  };