import { error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Grades from '$lib/server/database/schemas/Grades';
import * as gradesModule from '$src/routes/(app)/grades/+page.server';

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		error: vi.fn()
	};
});

vi.mock('$lib/server/database/schemas/Grades', () => {
	const GradesMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	GradesMock.find = vi.fn();
	return { default: GradesMock };
});

describe('Grades Module', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should throw an error if user is not authenticated or not a student', async () => {
			const locals = { user: null };
			const params = { workspace: 'workspace1' };
			await expect(gradesModule.load({ locals, params })).rejects.toEqual(
				error(401, 'Unauthorised')
			);

			locals.user = { role: 'lecturer' };
			await expect(gradesModule.load({ locals, params })).rejects.toEqual(
				error(401, 'Unauthorised')
			);
		});

		it('should return grades for a student user', async () => {
			const locals = { user: { id: 'student1', role: 'student' } };
			const params = { workspace: 'workspace1' };
			const mockGrades = [
				{
					mark: 85,
					quizID: { _id: 'quiz1', title: 'Quiz 1', date: new Date('2023-01-01') },
					workspaceID: { name: 'Workspace 1' }
				},
				{
					mark: 75,
					quizID: { _id: 'quiz2', title: 'Quiz 2', date: new Date('2023-01-15') },
					workspaceID: { name: 'Workspace 1' }
				}
			];
			const mockAllGrades = [{ mark: 85 }, { mark: 75 }, { mark: 65 }];

			(Grades.find as any).mockReturnValueOnce({
				populate: vi.fn().mockReturnThis(),
				lean: vi.fn().mockResolvedValueOnce(mockGrades)
			});
			(Grades.find as any).mockResolvedValue(mockAllGrades);

			const result = await gradesModule.load({ locals, params });

			expect(result).toEqual({
				workspaces: [
					{
						grades: [
							{
								average: 75,
								score: 85,
								assessment: 'Quiz 1',
								quizID: 'quiz1',
								date: 'Sun Jan 01 2023'
							},
							{
								average: 75,
								score: 75,
								assessment: 'Quiz 2',
								quizID: 'quiz2',
								date: 'Sun Jan 15 2023'
							}
						],
						name: 'Workspace 1'
					}
				]
			});

			expect(Grades.find).toHaveBeenCalledWith({
				quizID: 'quiz1'
			});
		});

		it('should handle errors when fetching grades', async () => {
			const locals = { user: { id: 'student1', role: 'student' } };
			const params = { workspace: 'workspace1' };
			(Grades.find as any).mockRejectedValue(new Error('Database error'));

			await expect(gradesModule.load({ locals, params })).rejects.toEqual(
				error(500, 'An error occurred while fetching grades')
			);
		});
	});
});
