// tests/quizLoad.test.ts
import { describe, test, expect, vi } from 'vitest';
import { load, actions } from './+page.server';
import Quizzes from '$db/schemas/Quiz';

vi.mock('$db/schemas/Quiz', async () => {
	const QuizMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	QuizMock.findById = vi.fn();

	return {
		default: QuizMock
	};
});

vi.mock('$db/schemas/Grades', async () => {
	const GradesMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	GradesMock.findById = vi.fn();

	return {
		default: GradesMock
	};
});

vi.mock('$db/schemas/Question', async () => {
	const QuestionMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	QuestionMock.find = vi.fn();
	return {
		default: QuestionMock
	};
});

vi.mock('$db/schemas/Material', async () => {
	const MaterialMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	MaterialMock.findById = vi.fn();

	return {
		default: MaterialMock
	};
});

describe('load function', () => {
	test('throws error if quiz is not found', async () => {
		const params = { workspace: 'workspace123', quiz: 'quiz123' };
		const locals = { user: { role: 'lecturer' } };

		Quizzes.findById.mockResolvedValue(null);

		try {
			await load({ params, locals });
		} catch (e) {
			expect(e.status).toBe(500);
			expect(e.body.message).toBe('Error occurred while fetching Questions');
		}
	});
});

describe('postMCQ action', () => {
	test('fails if the user is not a lecturer', async () => {
		const locals = { user: { role: 'student' } };
		const params = { quiz: 'quiz123' };
		const request = { formData: () => new FormData() };

		try {
			await actions.postMCQ({ request, locals, params });
		} catch (e) {
			expect(e.status).toBe(401);
			expect(e.body.message).toBe('Unauthorised');
		}
	});
});
