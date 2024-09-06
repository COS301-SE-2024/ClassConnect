import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fail } from '@sveltejs/kit';
import User from '$db/schemas/User';
import { sendPasswordResetEmail } from '$lib/server/utils/email';
import { createPasswordResetToken } from '$lib/server/utils/auth';
import * as forgotPasswordModule from '$src/routes/(auth)/forgot-password/+page.server';

vi.mock('$db/schemas/User', () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({}));

	UserMock.findOne = vi.fn();

	return { default: UserMock };
});

vi.mock('$lib/server/utils/email', () => ({
	sendPasswordResetEmail: vi.fn()
}));

vi.mock('$lib/server/utils/auth', () => ({
	createPasswordResetToken: vi.fn()
}));

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn()
	};
});

describe('Get Password Process', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('actions.default', () => {
		it('should fail when email is missing or invalid', async () => {
			const formData = new FormData();
			formData.append('email', '');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			await forgotPasswordModule.actions.default(event as any);
			expect(fail).toHaveBeenCalledWith(400, { error: 'Invalid email' });
		});

		it('should not fail when user is not found', async () => {
			const formData = new FormData();
			formData.append('email', 'nonexistent@example.com');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			(User.findOne as any).mockReturnValue({
				select: vi.fn().mockReturnValue({
					lean: vi.fn().mockResolvedValue(null)
				})
			});

			const result = await forgotPasswordModule.actions.default(event as any);
			expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
			expect(fail).not.toHaveBeenCalled();
			expect(result).toEqual({
				success: 'If an account exists with that email, a password reset link has been sent.'
			});
		});

		it('should send a password reset email when user is found', async () => {
			const formData = new FormData();
			formData.append('email', 'johndoe@example.com');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			const mockUser = {
				_id: 'userId123',
				email: 'johndoe@example.com'
			};

			(User.findOne as any).mockReturnValue({
				select: vi.fn().mockReturnValue({
					lean: vi.fn().mockResolvedValue(mockUser)
				})
			});

			(createPasswordResetToken as any).mockResolvedValue('resetToken123');

			const result = await forgotPasswordModule.actions.default(event as any);

			expect(User.findOne).toHaveBeenCalledWith({ email: 'johndoe@example.com' });
			expect(createPasswordResetToken).toHaveBeenCalledWith('userId123');
			expect(sendPasswordResetEmail).toHaveBeenCalledWith('johndoe@example.com', 'resetToken123');
			expect(result).toEqual({
				success: 'If an account exists with that email, a password reset link has been sent.'
			});
		});

		it('should handle unknown errors gracefully', async () => {
			const formData = new FormData();
			formData.append('email', 'johndoe@example.com');

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			(User.findOne as any).mockReturnValue({
				select: vi.fn().mockReturnValue({
					lean: vi.fn().mockResolvedValue(new Error('Database error'))
				})
			});

			await forgotPasswordModule.actions.default(event as any);

			expect(fail).toHaveBeenCalledWith(500, {
				error: 'An error occurred while processing your request. Please try again.'
			});
		});
	});
});
