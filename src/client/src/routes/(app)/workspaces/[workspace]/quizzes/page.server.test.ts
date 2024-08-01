import { fail, error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';

import Quizzes from '$db/schemas/Quiz';
import Activities from '$db/schemas/Activity';
import * as quizModule from './+page.server';

vi.mock('$db/schemas/Quiz', () => {
	const QuizMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	QuizMock.find = vi.fn();
	QuizMock.findByIdAndDelete = vi.fn();

	return { default: QuizMock };
});

vi.mock('$db/schemas/Activity', () => {
	const ActivityMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	return { default: ActivityMock };
});

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn(),
		error: vi.fn()
	};
});

describe('Quiz Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should return quizzes for a given workspace', async () => {
			const params = { workspace: 'workspace1' };
			const mockQuizzes = [
				{
					_id: '1',
					title: 'Quiz 1',
					instructions: 'Instructions 1',
					graded: true,
					date: new Date(),
					duration: 60
				},
				{
					_id: '2',
					title: 'Quiz 2',
					instructions: 'Instructions 2',
					graded: false,
					date: new Date(),
					duration: 45
				}
			];

			(Quizzes.find as any).mockResolvedValue(mockQuizzes);

			const result = await quizModule.load({ params } as any);

			expect(result).toEqual({
				workspaceID: 'workspace1',
				quizzes: mockQuizzes.map((quiz) => ({
					title: quiz.title,
					instructions: quiz.instructions,
					id: quiz._id.toString(),
					graded: quiz.graded,
					date: quiz.date.toISOString(),
					duration: quiz.duration
				}))
			});
		});

		it('should throw an error if fetching quizzes fails', async () => {
			const params = { workspace: 'workspace1' };

			(Quizzes.find as any).mockRejectedValue(new Error('Failed to fetch quizzes'));

			await expect(quizModule.load({ params } as any)).rejects.toEqual(
				error(500, 'Error occurred while fetching Quizzes')
			);
		});
	});

	describe('actions.post', () => {
		it('should create a new quiz successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('title', 'New Quiz');
			mockFormData.append('instructions', 'Some instructions');
			mockFormData.append('graded', 'No');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };
			const params = { workspace: 'workspace1' };

			const mockQuiz = { save: vi.fn() };
			const mockActivity = { save: vi.fn() };

			(Quizzes as any).mockImplementation(() => mockQuiz);
			(Activities as any).mockImplementation(() => mockActivity);

			const result = await quizModule.actions.post({ request: mockRequest, locals, params } as any);

			expect(result).toEqual({ success: true });
			expect(Quizzes).toHaveBeenCalledWith({
				title: 'New Quiz',
				graded: 'No',
				instructions: 'Some instructions',
				owner: new mongoose.Types.ObjectId(params.workspace),
				duration: 5000
			});
			expect(mockQuiz.save).toHaveBeenCalled();
			expect(Activities).toHaveBeenCalledWith({
				title: 'New Quiz: New Quiz',
				description: 'Some instructions',
				date: expect.any(Date),
				owner: new mongoose.Types.ObjectId(params.workspace),
				type: 'quiz'
			});
			expect(mockActivity.save).toHaveBeenCalled();
		});

		it('should fail if user is not lecturer', async () => {
			const locals = { user: { role: 'student' } };
			const params = { workspace: 'workspace1' };

			await expect(quizModule.actions.post({ locals, params } as any)).rejects.toEqual(
				error(401, 'Unauthorised')
			);
		});

		it('should fail if creating quiz fails', async () => {
			const mockFormData = new FormData();
			mockFormData.append('title', 'New Quiz');
			mockFormData.append('instructions', 'Some instructions');
			mockFormData.append('graded', 'No');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };
			const params = { workspace: 'workspace1' };

			(Quizzes as any).mockImplementation(() => {
				throw new Error('Failed to create quiz');
			});

			const result = await quizModule.actions.post({ request: mockRequest, locals, params } as any);

			expect(result).toEqual(fail(500, { error: 'Failed to post quiz' }));
		});
	});

	describe('actions.delete', () => {
		it('should delete a quiz successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };

			(Quizzes.findByIdAndDelete as any).mockResolvedValue({ _id: '123' });

			const result = await quizModule.actions.delete({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(Quizzes.findByIdAndDelete).toHaveBeenCalledWith('123');
		});

		it('should fail if quiz not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };

			(Quizzes.findByIdAndDelete as any).mockResolvedValue(null);

			const result = await quizModule.actions.delete({ request: mockRequest, locals } as any);

			expect(result).toEqual(fail(400, { error: 'Quiz ID is required' }));
		});

		it('should fail if user is not lecturer', async () => {
			const locals = { user: { role: 'student' } };

			await expect(quizModule.actions.delete({ locals } as any)).rejects.toEqual(
				error(401, 'Unauthorised')
			);
		});
	});
});
