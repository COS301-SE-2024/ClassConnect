import { fail, error, redirect } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Quizzes from '$db/schemas/Quiz';
import Questions from '$db/schemas/Question';
import Grade from '$db/schemas/Grades';
import * as quizModule from './+page.server';

vi.mock('$db/schemas/Quiz', () => {
	const QuizMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	QuizMock.find = vi.fn();
	QuizMock.findById = vi.fn();
	QuizMock.findByIdAndUpdate = vi.fn();
	QuizMock.findByIdAndDelete = vi.fn();

	return { default: QuizMock };
});

vi.mock('$db/schemas/Question', () => {
	const QuestionMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	QuestionMock.find = vi.fn();
	QuestionMock.findById = vi.fn();
	QuestionMock.findByIdAndDelete = vi.fn();

	return { default: QuestionMock };
});

vi.mock('$db/schemas/Grades', () => {
	const GradeMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	GradeMock.find = vi.fn();
	GradeMock.findById = vi.fn();
	GradeMock.findByIdAndDelete = vi.fn();

	return { default: GradeMock };
});

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn(),
		error: vi.fn(),
		redirect: vi.fn()
	};
});

describe('Quiz Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should return quiz data and questions', async () => {
			const params = { quiz: 'quiz1' };
			const locals = { user: { role: 'lecturer' } };
			const mockQuestions = [
				{
					_id: 'q1',
					questionNumber: 1,
					questionContent: 'Content1',
					questionType: 'multiple-choice',
					options: [
						{ content: 'Option1', points: 1 },
						{ content: 'Option2', points: 2 }
					]
				}
			];
			const mockQuiz = { _id: 'quiz1', duration: 60 };

			(Questions.find as any).mockResolvedValue(mockQuestions);
			(Quizzes.findById as any).mockResolvedValue(mockQuiz);

			const result = await quizModule.load({ params, locals } as any);

			expect(result).toEqual({
				role: 'lecturer',
				duration: 60,
				questions: [
					{
						id: 'q1',
						questionNumber: 1,
						questionContent: 'Content1',
						questionType: 'multiple-choice',
						options: [
							{ content: 'Option1', points: 1 },
							{ content: 'Option2', points: 2 }
						]
					}
				]
			});
		});

		it('should throw error if quiz not found', async () => {
			const params = { quiz: 'quiz1' };
			const locals = { user: { role: 'lecturer' } };

			(Questions.find as any).mockResolvedValue([]);
			(Quizzes.findById as any).mockResolvedValue(null);

			await expect(quizModule.load({ params, locals } as any)).rejects.toEqual(
				error(404, 'Quiz not found')
			);
		});
	});

	describe('actions.post', () => {
		it('should create a new question successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('questionNumber', '1');
			mockFormData.append('questionContent', 'New Question');
			mockFormData.append('options[0].content', 'Option1');
			mockFormData.append('options[0].points', '1');
			mockFormData.append('options[1].content', 'Option2');
			mockFormData.append('options[1].points', '2');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };
			const params = { quiz: 'quiz1' };

			const mockQuestion = { save: vi.fn() };
			(Questions as any).mockImplementation(() => mockQuestion);

			const result = await quizModule.actions.post({ request: mockRequest, locals, params } as any);

			expect(result).toEqual({ success: true });
			expect(Questions).toHaveBeenCalledWith({
				questionNumber: 1,
				questionContent: 'New Question',
				questionType: 'multiple-choice',
				options: [
					{ content: 'Option1', points: 1 },
					{ content: 'Option2', points: 2 }
				],
				quiz: new mongoose.Types.ObjectId(params.quiz)
			});
			expect(mockQuestion.save).toHaveBeenCalled();
		});

		it('should fail if user is not a lecturer', async () => {
			const locals = { user: { role: 'student' } };

			await expect(quizModule.actions.post({ locals } as any)).rejects.toEqual(
				error(401, 'Unauthorised')
			);
		});
	});

	describe('actions.submitQuiz', () => {
		it('should save the grade successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('mark', '80');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { id: 'student1' } };
			const params = { quiz: 'quiz1' };

			const mockQuiz = { _id: 'quiz1', owner: 'workspace1' };
			(Quizzes.findById as any).mockResolvedValue(mockQuiz);

			const mockGrade = { save: vi.fn() };
			(Grade as any).mockImplementation(() => mockGrade);

			const result = await quizModule.actions.submitQuiz({ request: mockRequest, locals, params } as any);

			expect(result).toEqual({ success: true, message: 'Quiz submitted successfully' });
			expect(Grade).toHaveBeenCalledWith({
				studentID: 'student1',
				quizID: 'quiz1',
				workspaceID: 'workspace1',
				mark: '80'
			});
			expect(mockGrade.save).toHaveBeenCalled();
		});

		it('should fail if quiz not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('mark', '80');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { id: 'student1' } };
			const params = { quiz: 'quiz1' };

			(Quizzes.findById as any).mockResolvedValue(null);

			await expect(quizModule.actions.submitQuiz({ request: mockRequest, locals, params } as any)).rejects.toEqual(
				error(404, 'Quiz not found')
			);
		});
	});
});
