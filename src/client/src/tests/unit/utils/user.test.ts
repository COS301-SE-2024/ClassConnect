import { Schema } from 'mongoose';
import { hash } from '@node-rs/argon2';
import { error, fail } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Users from '$db/schemas/User';
import { generateUsername } from '$utils/auth';
import { upload, deleteFile } from '$lib/server/storage';
import { addUser, getUsers, formatUser, editUser, deleteUser, validateUser } from '$utils/user';

vi.mock('@node-rs/argon2', () => ({
	hash: vi.fn()
}));

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return { ...actual, error: vi.fn(), fail: vi.fn() };
});

vi.mock('$utils/auth', () => ({
	generateUsername: vi.fn()
}));

vi.mock('$db/schemas/User', () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({}));

	UserMock.find = vi.fn();
	UserMock.findOne = vi.fn();
	UserMock.findByIdAndUpdate = vi.fn();
	UserMock.findByIdAndDelete = vi.fn();

	return { default: UserMock };
});

vi.mock('$lib/server/storage', () => ({
	upload: vi.fn(),
	deleteFile: vi.fn()
}));

describe('userUtils', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('formatUser', () => {
		it('should format user correctly', () => {
			const mockUser = {
				_id: '123',
				name: 'John',
				email: 'john@example.com',
				image: 'image.jpg',
				surname: 'Doe',
				username: 'a12345678'
			};

			const formattedUser = formatUser(mockUser);

			expect(formattedUser).toEqual({
				id: '123',
				name: 'John',
				email: 'john@example.com',
				image: 'image.jpg',
				surname: 'Doe',
				username: 'a12345678'
			});
		});
	});

	describe('getUsers', () => {
		it('should return formatted users', async () => {
			const mockUsers = [
				{ _id: '1', name: 'User1' },
				{ _id: '2', name: 'User2' }
			];
			const orgId = new Schema.Types.ObjectId('org123');

			Users.find = vi.fn().mockResolvedValue(mockUsers);

			const result = await getUsers('admin', orgId);

			expect(Users.find).toHaveBeenCalledWith({ role: 'admin', organisation: orgId });
			expect(result).toHaveLength(2);
			expect(result[0]).toHaveProperty('id', '1');
			expect(result[1]).toHaveProperty('id', '2');
		});
	});

	describe('validateUserRole', () => {
		it('should not throw error for valid role', () => {
			const locals = { user: { role: 'admin' } };

			expect(() => validateUser(locals, 'admin')).not.toThrow();
		});

		it('should throw error for invalid role', () => {
			const locals = { user: { role: 'user' } };

			try {
				validateUser(locals, 'admin');
			} catch (e) {
				expect(e).toEqual(error(401, 'Only admins can access this page'));
			}
		});
	});

	describe('addUser', () => {
		it('should add user successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('name', 'John');
			mockFormData.append('email', 'john@example.com');
			mockFormData.append('surname', 'Doe');

			const orgId = new Schema.Types.ObjectId('org123');

			Users.findOne = vi.fn().mockResolvedValue(null);
			(generateUsername as any).mockReturnValue('a12345678');
			(hash as any).mockResolvedValue('hashedPassword');
			Users.prototype.save = vi.fn().mockResolvedValue({});

			const result = await addUser(mockFormData, orgId, 'admin');

			expect(result).toEqual({ success: true });
			expect(Users.prototype.save).toHaveBeenCalled();
		});

		it('should fail if email already exists', async () => {
			const mockFormData = new FormData();
			mockFormData.append('email', 'existing@example.com');

			const orgId = new Schema.Types.ObjectId('org123');

			Users.findOne = vi.fn().mockResolvedValue({ email: 'existing@example.com' });
			(fail as any).mockReturnValue({ error: 'Email already in use' });

			const result = await addUser(mockFormData, orgId, 'admin');

			expect(result).toEqual({ error: 'Email already in use' });
		});
	});

	describe('editUser', () => {
		it('should edit user successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');
			mockFormData.append('name', 'Updated Name');

			Users.findByIdAndUpdate = vi.fn().mockResolvedValue({ name: 'Updated Name' });

			const result = await editUser(mockFormData);

			expect(result).toEqual({ success: true });
			expect(Users.findByIdAndUpdate).toHaveBeenCalledWith(
				'123',
				{ name: 'Updated Name', email: null, surname: null },
				{ new: true }
			);
		});

		it('should handle image upload when editing user', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');
			mockFormData.append('image', new File([''], 'test.jpg'));

			Users.findById = vi.fn().mockResolvedValue({ image: '/images/old-image.jpg' });
			(upload as any).mockResolvedValue('/images/new-image.jpg');
			Users.findByIdAndUpdate = vi.fn().mockResolvedValue({ image: '/images/new-image.jpg' });

			const result = await editUser(mockFormData);

			expect(result).toEqual({ success: true });
			expect(Users.findByIdAndUpdate).toHaveBeenCalledWith(
				'123',
				{ email: null, name: null, surname: null },
				{ new: true }
			);
		});
	});

	describe('deleteUser', () => {
		it('should delete user successfully', async () => {
			Users.findByIdAndDelete = vi.fn().mockResolvedValue({ _id: '123' });

			const result = await deleteUser('123');

			expect(result).toEqual({ success: true });
			expect(Users.findByIdAndDelete).toHaveBeenCalledWith('123');
		});

		it('should fail if user not found', async () => {
			Users.findByIdAndDelete = vi.fn().mockResolvedValue(null);
			(fail as any).mockReturnValue({ error: 'User not found' });

			const result = await deleteUser('nonexistent');

			expect(result).toEqual({ error: 'User not found' });
		});
	});
});
