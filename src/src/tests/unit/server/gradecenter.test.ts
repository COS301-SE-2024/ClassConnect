import { error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Quiz from '$db/schemas/Quiz';
import Grades from '$db/schemas/Grades';
import * as gradeCenterModule from '$src/routes/(app)/workspaces/[workspace]/gradecenter/+page.server';

vi.mock('$db/schemas/Quiz', () => {
	const QuizMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	QuizMock.find = vi.fn();
	return { default: QuizMock };
});

vi.mock('$db/schemas/Grades', () => {
	const GradesMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	GradesMock.find = vi.fn();
	return { default: GradesMock };
});

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');

	return {
		...actual,
		error: vi.fn()
	};
});

describe('Grade Center Load Function', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should throw 401 error if user is not a lecturer', async () => {
			const locals = { user: { role: 'student' } };
			await expect(gradeCenterModule.load({ locals })).rejects.toEqual(
				error(401, 'Only lecturers can access this page')
			);
		});

		it('should return combined assessment stats and grade center data for a lecturer', async () => {
			const locals = { user: { role: 'lecturer' } };

			const mockQuizzes = [
				{ _id: 'quiz1', title: 'Quiz 1', createdAt: new Date('2023-01-01') },
				{ _id: 'quiz2', title: 'Quiz 2', createdAt: new Date('2023-01-15') }
			];

			const mockGrades = [
				{
					quizID: 'quiz1',
					studentID: { _id: 'student1', username: 'user1', name: 'John', surname: 'Doe' },
					mark: 85
				},
				{
					quizID: 'quiz2',
					studentID: { _id: 'student2', username: 'user2', name: 'Jane', surname: 'Doe' },
					mark: 75
				}
			];

			(Quiz.find as any).mockReturnValueOnce({
				lean: vi.fn().mockResolvedValue(mockQuizzes)
			});

			(Grades.find as any).mockReturnValueOnce({
				lean: vi.fn().mockResolvedValue(mockGrades)
			});

			(Quiz.find as any).mockReturnValueOnce({
				lean: vi.fn().mockReturnValueOnce({
					select: vi.fn().mockReturnValueOnce({
						sort: vi.fn().mockResolvedValue(mockQuizzes)
					})
				})
			});

			(Grades.find as any).mockReturnValueOnce({
				lean: vi.fn().mockReturnValueOnce({
					populate: vi.fn().mockResolvedValueOnce(mockGrades)
				})
			});

			const result = await gradeCenterModule.load({ locals });

			expect(result).toEqual({
				students: [
					{
						name: 'John Doe',
						username: 'user1',
						grades: [85, 0]
					},
					{
						name: 'Jane Doe',
						username: 'user2',
						grades: [0, 75]
					}
				],
				assessments: ['Quiz 1', 'Quiz 2'],
				stats: [
					{
						name: 'Quiz 1',
						submitted: 1,
						average: 85,
						passRate: 100
					},
					{
						name: 'Quiz 2',
						submitted: 1,
						average: 75,
						passRate: 100
					}
				]
			});
		});

		it('should throw 500 error if fetching data fails', async () => {
			const locals = { user: { role: 'lecturer' } };

			(Quiz.find as any).mockRejectedValue(new Error('Database error'));
			(Grades.find as any).mockRejectedValue(new Error('Database error'));

			await expect(gradeCenterModule.load({ locals })).rejects.toEqual(
				error(500, 'An error occurred while loading the page data')
			);
		});
	});
});
