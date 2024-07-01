import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import User from '$db/schemas/User';
import { lucia } from '$lib/server/auth';
import * as signInModule from './+page.server';

vi.mock('$db/schemas/User', () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({}));
	UserMock.findOne = vi.fn();

	return { default: UserMock };
});

vi.mock('@node-rs/argon2', () => ({
	verify: vi.fn()
}));

vi.mock('$lib/server/auth', () => ({
	lucia: {
		createSession: vi.fn(),
		createSessionCookie: vi.fn()
	}
}));

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');

	return {
		...actual,
		fail: vi.fn(),
		redirect: vi.fn()
	};
});

describe('Authentication Process', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should redirect if user exists in locals', async () => {
			const locals = { user: { id: '123' } };
			await signInModule.load({ locals });

			expect(redirect).toHaveBeenCalledWith(302, '/home');
		});

		it('should not redirect if not signed in', async () => {
			const locals = { user: null };
			const result = await signInModule.load({ locals });

			expect(redirect).not.toHaveBeenCalled();
			expect(result).toBeUndefined();
		});
	});

	describe('actions.default', () => {
		it('should handle successful authentication', async () => {
			const formData = new FormData();
			formData.append('username', 'johndoe');
			formData.append('password', 'ValidP@ss123');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				},
				cookies: {
					set: vi.fn()
				}
			};

			const mockUser = { _id: '123', password: 'hashedPassword', role: 'user' };

			(User.findOne as any).mockResolvedValue(mockUser);
			(verify as any).mockResolvedValue(true);
			(lucia.createSession as any).mockResolvedValue({ id: 'session123' });
			(lucia.createSessionCookie as any).mockReturnValue({
				name: 'session',
				value: 'cookievalue',
				attributes: {}
			});

			await signInModule.actions.default(event as any);

			expect(User.findOne).toHaveBeenCalledWith({ username: 'johndoe' });
			expect(verify).toHaveBeenCalledWith('hashedPassword', 'ValidP@ss123');
			expect(lucia.createSession).toHaveBeenCalledWith('123', { role: 'user' });
			expect(lucia.createSessionCookie).toHaveBeenCalledWith('session123');
			expect(event.cookies.set).toHaveBeenCalledWith(
				'session',
				'cookievalue',
				expect.objectContaining({ path: '.' })
			);
			expect(redirect).toHaveBeenCalledWith(302, '/home');
		});

		it('should handle invalid username', async () => {
			const formData = new FormData();
			formData.append('username', '');
			formData.append('password', 'ValidP@ss123');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			await signInModule.actions.default(event as any);
			expect(fail).toHaveBeenCalledWith(400, { error: 'Invalid username' });
		});

		it('should handle invalid password', async () => {
			const formData = new FormData();
			formData.append('username', 'johndoe');
			formData.append('password', '');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			await signInModule.actions.default(event as any);
			expect(fail).toHaveBeenCalledWith(400, { error: 'Invalid password' });
		});

		it('should handle non-existent user', async () => {
			const formData = new FormData();
			formData.append('username', 'nonexistent');
			formData.append('password', 'ValidP@ss123');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			(User.findOne as any).mockResolvedValue(null);

			await signInModule.actions.default(event as any);
			expect(fail).toHaveBeenCalledWith(400, { error: 'Username does not exist' });
		});

		it('should handle incorrect password', async () => {
			const formData = new FormData();
			formData.append('username', 'johndoe');
			formData.append('password', 'WrongP@ss123');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			const mockUser = { _id: '123', password: 'hashedPassword', role: 'user' };

			(User.findOne as any).mockResolvedValue(mockUser);
			(verify as any).mockResolvedValue(false);

			await signInModule.actions.default(event as any);
			expect(fail).toHaveBeenCalledWith(400, { error: 'Incorrect password' });
		});

		it('should handle unknown errors', async () => {
			const formData = new FormData();
			formData.append('username', 'johndoe');
			formData.append('password', 'ValidP@ss123');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			(User.findOne as any).mockRejectedValue(new Error('Database error'));

			await signInModule.actions.default(event as any);
			expect(fail).toHaveBeenCalledWith(500, { error: 'An unknown error occurred' });
		});
	});
});
