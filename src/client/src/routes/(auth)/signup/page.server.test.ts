import sgMail from '@sendgrid/mail';
import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { TEST_PASSWORD } from '$env/static/private';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import User from '$db/schemas/User';
import * as signupModule from './+page.server';
import { generateUsername } from '$src/utils/auth';

vi.mock('$db/schemas/User', () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({}));
	UserMock.findOne = vi.fn();

	return { default: UserMock };
});

vi.mock('@sendgrid/mail', () => ({
	default: {
		setApiKey: vi.fn(),
		send: vi.fn()
	}
}));

vi.mock('@node-rs/argon2', () => ({
	hash: vi.fn()
}));

vi.mock('$utils/auth', () => ({
	generateUsername: vi.fn()
}));

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');

	return {
		...actual,
		fail: vi.fn(),
		redirect: vi.fn()
	};
});

describe('Signup Process', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should redirect if user exists in locals', async () => {
			const locals = { user: { id: '123' } };
			await signupModule.load({ locals });

			expect(redirect).toHaveBeenCalledWith(302, '/home');
		});

		it('should not redirect if in signed in', async () => {
			const locals = { user: null };
			const result = await signupModule.load({ locals });

			expect(redirect).not.toHaveBeenCalled();
			expect(result).toBeUndefined();
		});
	});

	describe('actions.default', () => {
		it('should handle successful signup', async () => {
			const formData = new FormData();
			formData.append('name', 'John');
			formData.append('surname', 'Doe');
			formData.append('email', 'john@example.com');
			formData.append('password', TEST_PASSWORD);
			formData.append('confirm-password', TEST_PASSWORD);

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			(User.findOne as any).mockResolvedValue(null);
			(generateUsername as any).mockReturnValue('johndoe');
			(hash as any).mockResolvedValue('hashedPassword');
			(sgMail.send as any).mockResolvedValue(undefined);
			(User as any).mockImplementation(() => ({ save: vi.fn() }));

			await signupModule.actions.default(event as any);

			expect(User).toHaveBeenCalledWith({
				name: 'John',
				surname: 'Doe',
				username: 'johndoe',
				email: 'john@example.com',
				role: 'admin',
				image: 'images/profile-placeholder.png',
				password: 'hashedPassword'
			});

			expect(redirect).toHaveBeenCalledWith(303, '/signup/successful?name=John');
		});

		it('should handle signup failure', async () => {
			const formData = new FormData();
			formData.append('name', '');
			formData.append('surname', 'Doe');
			formData.append('email', 'john@example.com');
			formData.append('password', TEST_PASSWORD);
			formData.append('confirm-password', TEST_PASSWORD);

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			await signupModule.actions.default(event as any);

			expect(fail).toHaveBeenCalledWith(400, { error: 'Invalid name' });
		});

		it('should handle existing email', async () => {
			const formData = new FormData();
			formData.append('name', 'John');
			formData.append('surname', 'Doe');
			formData.append('email', 'existing@example.com');
			formData.append('password', TEST_PASSWORD);
			formData.append('confirm-password', TEST_PASSWORD);

			const event = {
				request: {
					formData: () => Promise.resolve(formData)
				}
			};

			(User.findOne as any).mockResolvedValue({ email: 'existing@example.com' });

			await signupModule.actions.default(event as any);

			expect(fail).toHaveBeenCalledWith(400, { error: 'Email already exists' });
		});
	});
});
