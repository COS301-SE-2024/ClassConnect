import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fail } from '@sveltejs/kit';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import { hash } from '@node-rs/argon2';
import PasswordResetToken from '$db/schemas/PasswordResetToken';
import User from '$db/schemas/User';
import Session from '$db/schemas/Session';
import { lucia } from '$lib/server/auth';
import { isWithinExpirationDate } from 'oslo';
import { HASH_OPTIONS } from '$src/constants';
import * as passwordResetModule from '$src/routes/(auth)/reset-password/[token]/+page.server';

vi.mock('oslo/crypto', () => ({
	sha256: vi.fn()
}));

vi.mock('oslo/encoding', () => ({
	encodeHex: vi.fn()
}));

vi.mock('@node-rs/argon2', () => ({
	hash: vi.fn()
}));

vi.mock('oslo', () => ({
	isWithinExpirationDate: vi.fn()
}));

vi.mock('$db/schemas/PasswordResetToken', () => {
	const PasswordResetTokenMock: any = vi.fn().mockImplementation(() => ({}));
	PasswordResetTokenMock.findOne = vi.fn();
	PasswordResetTokenMock.deleteOne = vi.fn();

	return { default: PasswordResetTokenMock };
});

vi.mock('$db/schemas/User', () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({}));

	UserMock.findByIdAndUpdate = vi.fn();

	return { default: UserMock };
});

vi.mock('$lib/server/utils/auth', () => ({
	validatePassword: vi.fn()
}));

vi.mock('$db/schemas/Session', () => {
	const SessionMock: any = vi.fn().mockImplementation(() => ({}));

	SessionMock.deleteMany = vi.fn();

	return { default: SessionMock };
});

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
		fail: vi.fn()
	};
});

describe('Password Reset Process', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('actions.default', () => {
		it('should fail when required fields are missing', async () => {
			const event = {
				request: {
					formData: () => Promise.resolve(new FormData())
				},
				params: {},
				locals: {},
				cookies: {}
			};

			await passwordResetModule.actions.default(event as any);
			expect(fail).toHaveBeenCalledWith(400, { error: 'All fields are required' });
		});

		it('should fail when password validation fails', async () => {
			const formData = new FormData();
			formData.append('password', 'password1');
			formData.append('confirmPassword', 'password2');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				},
				params: { token: 'validToken' },
				locals: {},
				cookies: {}
			};

			await passwordResetModule.actions.default(event as any);
			expect(fail).toHaveBeenCalledWith(400, { error: 'Invalid or expired password reset token' });
		});

		it('should fail when the token is invalid or expired', async () => {
			const formData = new FormData();
			formData.append('password', 'password');
			formData.append('confirmPassword', 'password');
			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				},
				params: { token: 'validToken' },
				locals: {},
				cookies: {}
			};

			const mockToken = {
				token_hash: 'hashedToken',
				expires_at: new Date(Date.now() - 1000),
				user_id: '123'
			};

			(sha256 as any).mockResolvedValue('hashedToken');
			(encodeHex as any).mockReturnValue('hashedToken');
			(PasswordResetToken.findOne as any).mockResolvedValue(mockToken);
			(isWithinExpirationDate as any).mockReturnValue(false);

			await passwordResetModule.actions.default(event as any);
			expect(fail).toHaveBeenCalledWith(400, { error: 'Invalid or expired password reset token' });
		});

		it('should reset password and invalidate sessions successfully', async () => {
			const formData = new FormData();
			formData.append('password', 'password');
			formData.append('confirmPassword', 'password');
			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				},
				params: { token: 'validToken' },
				locals: { session: { id: 'sessionId' } },
				cookies: {
					set: vi.fn()
				}
			};

			const mockToken = {
				token_hash: 'hashedToken',
				expires_at: new Date(Date.now() + 1000),
				user_id: '123'
			};

			(sha256 as any).mockResolvedValue('hashedToken');
			(encodeHex as any).mockReturnValue('hashedToken');
			(PasswordResetToken.findOne as any).mockResolvedValue(mockToken);
			(isWithinExpirationDate as any).mockReturnValue(true);
			(hash as any).mockResolvedValue('hashedPassword');

			await passwordResetModule.actions.default(event as any);

			expect(Session.deleteMany as any).toHaveBeenCalledWith({ user_id: '123' });
			expect(User.findByIdAndUpdate as any).toHaveBeenCalledWith('123', {
				password: 'hashedPassword',
				custom_password: true
			});
			expect(PasswordResetToken.deleteOne).toHaveBeenCalledWith({ token_hash: 'hashedToken' });
			expect(lucia.invalidateSession).toHaveBeenCalledWith('sessionId');
		});

		it('should handle unknown errors during password reset', async () => {
			const formData = new FormData();
			formData.append('password', 'password');
			formData.append('confirmPassword', 'password');
			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				},
				params: { token: 'validToken' },
				locals: {},
				cookies: {}
			};

			(sha256 as any).mockRejectedValue(new Error('Token hash error'));

			await passwordResetModule.actions.default(event as any);
			expect(fail).toHaveBeenCalledWith(500, {
				error: 'An error occurred while resetting your password. Please try again.'
			});
		});
	});
});

// Ashley Kapaso u21525600
