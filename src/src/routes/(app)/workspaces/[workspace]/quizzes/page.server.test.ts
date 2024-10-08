import { describe, it, expect, vi, beforeEach } from 'vitest';
//import mongoose from 'mongoose';

import Quizzes from '$db/schemas/Quiz';
import Activities from '$db/schemas/Activity';
import * as quizzesModule from './+page.server';

vi.mock('$db/schemas/Quiz', () => {
	const QuizzesMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	QuizzesMock.find = vi.fn();
	QuizzesMock.findById = vi.fn();
	QuizzesMock.findByIdAndDelete = vi.fn();

	return { default: QuizzesMock };
});

vi.mock('$db/schemas/Activity', () => {
	const ActivitiesMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	return { default: ActivitiesMock };
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

describe('Quizzes Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('actions.post', () => {
		it('should create a new quiz successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('title', 'New Quiz');
			mockFormData.append('duration', '60');
			mockFormData.append('instructions', 'Quiz instructions');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const mockWorkspaceId = 'workspace1';
			const locals = { user: { role: 'lecturer' } };
			const params = { workspace: mockWorkspaceId };

			const mockQuiz = { save: vi.fn().mockResolvedValue(undefined) };
			const mockActivity = { save: vi.fn().mockResolvedValue(undefined) };

			(Quizzes as any).mockImplementation(() => mockQuiz);
			(Activities as any).mockImplementation(() => mockActivity);

			const result = await quizzesModule.actions.post({
				request: mockRequest,
				locals,
				params
			} as any);

			expect(result).toEqual({ success: true });
			expect(Quizzes).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'New Quiz',
					graded: 'No',
					instructions: 'Quiz instructions',
					owner: expect.any(Object),
					duration: 3600000
				})
			);
			expect(mockQuiz.save).toHaveBeenCalled();
			expect(Activities).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'New Quiz: New Quiz',
					description: 'Quiz instructions',
					date: expect.any(Date),
					owner: expect.any(Object),
					type: 'quiz'
				})
			);
			expect(mockActivity.save).toHaveBeenCalled();
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

				const result = await quizzesModule.actions.delete({ request: mockRequest, locals } as any);

				expect(result).toEqual({ success: true });
				expect(Quizzes.findByIdAndDelete).toHaveBeenCalledWith('123');
			});
		});
	});
});
