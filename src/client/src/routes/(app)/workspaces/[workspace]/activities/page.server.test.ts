import { error, redirect } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as activityModule from './+page.server';

vi.mock('$db/schemas/Activity', () => {
	const ActivityMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	ActivityMock.find = vi.fn().mockReturnThis();
	ActivityMock.sort = vi.fn().mockReturnThis();
	ActivityMock.lean = vi.fn();

	return { default: ActivityMock };
});

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		error: vi.fn(),
		redirect: vi.fn()
	};
});

describe('Activity Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should redirect to signin if user is not logged in', async () => {
			const locals = { user: null };
			const params = { workspace: 'workspace1' };

			await activityModule.load({ locals, params } as any);

			expect(redirect).toHaveBeenCalledWith(302, '/signin');
		});

		it('should throw unauthorized error if user is not a student', async () => {
			const locals = { user: { role: 'teacher' } };
			const params = { workspace: 'workspace1' };

			await expect(activityModule.load({ locals, params } as any)).rejects.toEqual(
				error(401, 'Unauthorized')
			);
		});
	});
});
