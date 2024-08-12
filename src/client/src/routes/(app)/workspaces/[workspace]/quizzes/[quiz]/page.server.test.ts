import { fail } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
//import mongoose from 'mongoose';

import Quizzes from '$db/schemas/Quiz';
import Questions from '$db/schemas/Question';
import Grades from '$db/schemas/Grades';
import * as quizzesModule from './+page.server';

vi.mock('$db/schemas/Quiz', () => {
	const QuizzesMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	QuizzesMock.findById = vi.fn();
	return { default: QuizzesMock };
});

vi.mock('$db/schemas/Question', () => {
	const QuestionsMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	QuestionsMock.find = vi.fn();
	return { default: QuestionsMock };
});

vi.mock('$db/schemas/Grades', () => {
	const GradesMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	return { default: GradesMock };
});

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn(),
		error: vi.fn()
	};
});

vi.mock('mongoose', () => ({
	default: {
		Types: {
			ObjectId: vi.fn().mockImplementation((id) => ({ _id: id }))
		}
	}
}));

describe('Quiz Actions', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('actions.post', () => {
		it('should create a new question successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('questionNumber', '1');
			mockFormData.append('questionContent', 'What is 2 + 2?');
			mockFormData.append('options[0].content', '3');
			mockFormData.append('options[0].points', '0');
			mockFormData.append('options[1].content', '4');
			mockFormData.append('options[1].points', '1');
			mockFormData.append('options[2].content', '5');
			mockFormData.append('options[2].points', '0');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };
			const params = { quiz: 'quiz123' };

			const mockQuestion = { save: vi.fn().mockResolvedValue(undefined) };
			(Questions as any).mockImplementation(() => mockQuestion);

			const result = await quizzesModule.actions.post({
				request: mockRequest,
				locals,
				params
			} as any);

			expect(result).toEqual({ success: true });
			expect(Questions).toHaveBeenCalledWith(
				expect.objectContaining({
					questionNumber: 1,
					questionContent: 'What is 2 + 2?',
					questionType: 'multiple-choice',
					options: [
						{ content: '3', points: 0 },
						{ content: '4', points: 1 },
						{ content: '5', points: 0 }
					],
					quiz: expect.any(Object)
				})
			);
			expect(mockQuestion.save).toHaveBeenCalled();
		});
	});

	describe('actions.submitQuiz', () => {
		it('should save grade successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('mark', '95');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { id: 'student123' } };
			const params = { quiz: 'quiz123' };

			const mockQuiz = { id: 'quiz123', owner: 'workspace123' };
			(Quizzes.findById as any).mockResolvedValue(mockQuiz);

			const mockGrade = { save: vi.fn().mockResolvedValue(undefined) };
			(Grades as any).mockImplementation(() => mockGrade);

			const result = await quizzesModule.actions.submitQuiz({
				request: mockRequest,
				locals,
				params
			} as any);

			expect(result).toEqual({ success: true, message: 'Quiz submitted successfully' });
			expect(Grades).toHaveBeenCalledWith(
				expect.objectContaining({
					studentID: expect.any(String),
					quizID: expect.any(String),
					workspaceID: expect.any(String),
					mark: expect.any(String)
				})
			);
			expect(mockGrade.save).toHaveBeenCalled();
		});

		it('should return 404 if quiz is not found', async () => {
			const mockRequest = {
				formData: vi.fn().mockResolvedValue(new FormData())
			};

			const locals = { user: { id: 'student123' } };
			const params = { quiz: 'quiz123' };

			(Quizzes.findById as any).mockResolvedValue(null);

			await quizzesModule.actions.submitQuiz({ request: mockRequest, locals, params } as any);

			expect(fail).toHaveBeenCalledWith(500, { error: 'Failed to save grade' });
		});
	});
});
