import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hash } from '@node-rs/argon2';
import { parse } from 'csv-parse/sync';
import { fail, error } from '@sveltejs/kit';
import Users from '$db/schemas/User';
import Organisation from '$db/schemas/Organisation';
import { generateUsername } from '$src/lib/server/utils/auth';
// import { sendWelcomeEmail } from './email';
// import { upload, deleteFile } from '../storage';
import {
	formatUser,
	getUsers,
	validateUser,
	addUser,
	editUser,
	deleteUser,
	addUsers
} from '$lib/server/utils/users';
// import { HASH_OPTIONS } from '$src/constants';

// Mock dependencies
vi.mock('$db/schemas/User', async () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	UserMock.findByIdAndUpdate = vi.fn();
	UserMock.findById = vi.fn();
	UserMock.findByIdAndDelete = vi.fn();
	UserMock.findOne = vi.fn();
	UserMock.find = vi.fn();

	return {
		default: UserMock
	};
});

vi.mock('$db/schemas/PasswordResetToken', async () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	UserMock.findByIdAndUpdate = vi.fn();
	UserMock.findById = vi.fn();
	UserMock.findByIdAndDelete = vi.fn();
	UserMock.findOne = vi.fn();
	UserMock.find = vi.fn();

	return {
		default: UserMock
	};
});

vi.mock('$db/schemas/Organisation', async () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	UserMock.findByIdAndUpdate = vi.fn();
	UserMock.findById = vi.fn();
	UserMock.findByIdAndDelete = vi.fn();
	UserMock.findOne = vi.fn();
	UserMock.find = vi.fn();

	return {
		default: UserMock
	};
});
vi.mock('./auth', () => ({
	generateUsername: vi.fn()
}));

vi.mock('./email', () => ({
	sendWelcomeEmail: vi.fn()
}));

vi.mock('../storage', () => ({
	upload: vi.fn()
}));

vi.mock('@node-rs/argon2', () => ({
	hash: vi.fn()
}));

vi.mock('csv-parse/sync', () => ({
	parse: vi.fn()
}));

describe('User Module', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('formatUser', () => {
		it('should format user correctly', () => {
			const user = {
				_id: '123',
				name: 'John',
				email: 'john@example.com',
				image: 'image.png',
				surname: 'Doe',
				username: 'johndoe',
				workspaces: ['workspace1', 'workspace2']
			};

			const formattedUser = formatUser(user);
			expect(formattedUser).toEqual({
				id: '123',
				name: 'John',
				email: 'john@example.com',
				image: 'image.png',
				surname: 'Doe',
				username: 'johndoe',
				workspaces: ['workspace1', 'workspace2']
			});
		});
	});

	describe('getUsers', () => {
		it('should return formatted users', async () => {
			const users = [
				{
					_id: '123',
					name: 'John',
					email: 'john@example.com',
					image: 'image.png',
					surname: 'Doe',
					username: 'johndoe',
					workspaces: ['workspace1', 'workspace2']
				}
			];
			Users.find.mockResolvedValue(users);

			const result = await getUsers('admin', 'org123');
			expect(result).toEqual([
				{
					id: '123',
					name: 'John',
					email: 'john@example.com',
					image: 'image.png',
					surname: 'Doe',
					username: 'johndoe',
					workspaces: ['workspace1', 'workspace2']
				}
			]);
		});
	});

	describe('validateUser', () => {
		it('should throw error if user role does not match', () => {
			const locals = { user: { role: 'user' } };
			try {
				validateUser(locals, 'admin');
			} catch (e) {
				expect(e.status).toEqual(401);
			}
		});

		it('should not throw error if user role matches', () => {
			const locals = { user: { role: 'admin' } };
			expect(() => validateUser(locals, 'admin')).not.toThrow();
		});
	});

	describe('addUser', () => {
		it('should return error if email already in use', async () => {
			const formData = new FormData();
			formData.append('name', 'John');
			formData.append('email', 'john@example.com');
			formData.append('surname', 'Doe');

			Users.findOne.mockResolvedValue({});

			const result = await addUser(formData, 'org123', 'admin');
			expect(result).toEqual(fail(400, { error: 'Email already in use' }));
		});
	});

	describe('editUser', () => {
		it('should edit an existing user', async () => {
			const formData = new FormData();
			formData.append('id', '123');
			formData.append('name', 'John');
			formData.append('email', 'john@example.com');
			formData.append('surname', 'Doe');

			Users.findById.mockResolvedValue({ image: '/images/profile-placeholder.png' });
			Users.findByIdAndUpdate.mockResolvedValue({});

			const result = await editUser(formData);
			expect(result).toEqual({ success: true });
		});
	});

	describe('deleteUser', () => {
		it('should delete an existing user', async () => {
			Users.findByIdAndDelete.mockResolvedValue({ image: '/images/profile-placeholder.png' });

			const result = await deleteUser('123');
			expect(result).toEqual({ success: true });
		});

		it('should return error if user ID is not provided', async () => {
			const result = await deleteUser('');
			expect(result).toEqual(fail(400, { error: 'User ID is required' }));
		});
	});
});
