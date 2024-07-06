import { describe, it, expect, vi, beforeEach } from 'vitest';
import { lucia } from '$lib/server/auth';
import * as moduleToTest from './+page.server';
import { error, fail, redirect } from '@sveltejs/kit';

vi.mock('$lib/server/auth', () => ({
	lucia: {
		invalidateSession: vi.fn(),
		createBlankSessionCookie: vi.fn()
	}
}));

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		error: vi.fn(),
		fail: vi.fn(),
		redirect: vi.fn()
	};
});

describe('Module to Test', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should throw 401 error if user does not exist in locals', async () => {
			const locals = { user: null };

			try {
				await moduleToTest.load({ locals });
			} catch (e) {
				expect(e).toEqual(error(401));
			}

			expect(error).toHaveBeenCalledWith(401);
		});

		it('should not throw error if user exists in locals', async () => {
			const locals = { user: { id: '123' } };

			await expect(moduleToTest.load({ locals })).resolves.toBeUndefined();
			expect(error).not.toHaveBeenCalled();
		});
	});

	describe('actions.default', () => {
		it('should fail with 401 if session does not exist in event.locals', async () => {
			const event = {
				locals: { session: null }
			};

			const result = await moduleToTest.actions.default(event as any);
			expect(result).toEqual(fail(401));
			expect(fail).toHaveBeenCalledWith(401);
		});

		it('should invalidate session, set cookie and redirect if session exists', async () => {
			const event = {
				locals: { session: { id: 'session123' } },
				cookies: {
					set: vi.fn()
				}
			};

			const mockSessionCookie = { name: 'session', value: 'cookievalue', attributes: {} };
			(lucia.invalidateSession as any).mockResolvedValue(true);
			(lucia.createBlankSessionCookie as any).mockReturnValue(mockSessionCookie);

			await moduleToTest.actions.default(event as any);

			expect(lucia.invalidateSession).toHaveBeenCalledWith('session123');
			expect(lucia.createBlankSessionCookie).toHaveBeenCalled();
			expect(event.cookies.set).toHaveBeenCalledWith(
				mockSessionCookie.name,
				mockSessionCookie.value,
				expect.objectContaining({ path: '.' })
			);
			expect(redirect).toHaveBeenCalledWith(302, '/');
		});
	});
});
