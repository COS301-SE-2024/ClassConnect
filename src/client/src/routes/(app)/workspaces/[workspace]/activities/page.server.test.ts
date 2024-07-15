import { error, redirect } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Activities from '$db/schemas/Activity';
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

			const result = await activityModule.load({ locals, params } as any);

			expect(redirect).toHaveBeenCalledWith(302, '/signin');
		});

		it('should throw unauthorized error if user is not a student', async () => {
			const locals = { user: { role: 'teacher' } };
			const params = { workspace: 'workspace1' };

			await expect(activityModule.load({ locals, params } as any)).rejects.toEqual(
				error(401, 'Unauthorized')
			);
		});

		it('should return activities successfully', async () => {
			const locals = { user: { role: 'student' } };
			const params = { workspace: 'workspace1' };
			const mockActivities = [
				{ _id: '1', date: new Date(), title: 'Title1', description: 'Desc1', type: 'Type1' },
				{ _id: '2', date: new Date(), title: 'Title2', description: 'Desc2', type: 'Type2' }
			];

			(Activities.find as any).mockResolvedValue(mockActivities);

			const result = await activityModule.load({ locals, params } as any);

			expect(result).toEqual({
				activities: [
					{ id: '1', date: expect.any(Date), title: 'Title1', description: 'Desc1', type: 'Type1' },
					{ id: '2', date: expect.any(Date), title: 'Title2', description: 'Desc2', type: 'Type2' }
				]
			});
		});

		it('should throw error on server error', async () => {
			const locals = { user: { role: 'student' } };
			const params = { workspace: 'workspace1' };

			(Activities.find as any).mockRejectedValue(new Error('Database error'));

			await expect(activityModule.load({ locals, params } as any)).rejects.toEqual(
				error(500, 'Failed to load activities')
			);
		});
	});
});
