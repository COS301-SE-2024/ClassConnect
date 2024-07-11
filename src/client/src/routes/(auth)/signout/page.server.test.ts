import { describe, it, expect, vi, beforeEach } from 'vitest';
import { lucia } from '$lib/server/auth';
import * as signoutModule from './+page.server';
import { error, redirect } from '@sveltejs/kit';

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

describe('Sign Out Module', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should throw 404 error if user does not exist in locals', async () => {
			const locals = { user: null };

			try {
				await signoutModule.load({ locals });
			} catch (e) {
				expect(e).toEqual(error(404));
			}
		});

		it('should not throw error if user exists in locals', async () => {
			const locals = { user: { id: '123' } };

			await expect(signoutModule.load({ locals })).resolves.toBeUndefined();
			expect(error).not.toHaveBeenCalled();
		});
	});

	describe('actions.default', () => {
		it('should fail with 404 if session does not exist in event.locals', async () => {
			const event = {
				locals: { session: null }
			};

			try {
				await signoutModule.actions.default(event as any);
			} catch (e) {
				expect(e).toEqual(error(404));
			}

			expect(error).toHaveBeenCalledWith(404);
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

			await signoutModule.actions.default(event as any);

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
