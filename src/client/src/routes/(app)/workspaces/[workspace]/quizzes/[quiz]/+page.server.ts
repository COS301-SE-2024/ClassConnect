//[quiz].page.server.ts


import type { Actions, PageServerLoad } from './$types';
import { fail, error } from '@sveltejs/kit';
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import Quizzes from '$db/schemas/Quiz';
import Questions from '$db/schemas/Question';
import Grade from '$db/schemas/Grades';

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const role = locals.user?.role;
		const workspaceID = params.workspace;
		const quizId = params.quiz;
		const questions = await Questions.find({ quiz: quizId });

		const quiz = await Quizzes.findById(quizId);
		if (!quiz) {
			throw error(404, 'Quiz not found');
		}
		const duration = quiz.duration;
		//const workspaceID = quiz.owner.toString();
		//const quizID = quiz.id;

		return {
			role,
			duration,
			questions: questions.map((q) => ({
				id: q._id.toString(),
				questionNumber: q.questionNumber,
				questionContent: q.questionContent,
				questionType: q.questionType,
				options: q.options.map((option: { content: any; points: any }) => ({
					content: option.content,
					points: option.points
				}))
			})),
			workspaceID
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
	options: { content: string; points: number }[],
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
	return { success: true };
}

//saving marks
async function saveGrade(
	studentID: ObjectId,
	quizID: ObjectId,
	workspaceID: ObjectId,
	mark: number
) {
	const newGrade = new Grade({
		studentID,
		quizID,
		workspaceID,
		mark
	});
	console.log(newGrade);
	await newGrade.save();
	return { success: true };
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
			for (let i = 0; i < 3; i++) {
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
	},
	submitQuiz: async ({ request, locals, params }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized');
		}

		try {
			const data = await request.formData();
			const studentID = locals.user.id;
			const mark = data.get('mark');
			const quiz = await Quizzes.findById(params.quiz);
			if (!quiz) {
				throw error(404, 'Quiz not found');
			}
			const workspaceID = quiz.owner;
			const quizID = quiz.id;

			console.log(data);
			if (!quizID || !workspaceID) {
				return fail(400, { error: 'Invalid submission data' });
			}

			const savedGrade = await saveGrade(studentID, quizID, workspaceID, mark);

			if (savedGrade.success) {
				return { success: true, message: 'Quiz submitted successfully' };
			} else {
				return fail(500, { error: 'Failed to save grade' });
			}
		} catch (error) {
			console.error('Error saving grade:', error);
			return fail(500, { error: 'Failed to save grade' });
		}
	}
};
