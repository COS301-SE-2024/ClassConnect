import { hash } from '@node-rs/argon2';
import { fail, error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import User from '$db/schemas/User';
import { generateUsername } from '$utils/user';
import * as adminModule from './+page.server';

vi.mock('$db/schemas/User', () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({}));

	UserMock.find = vi.fn();
	UserMock.findOne = vi.fn();
	UserMock.findOne = vi.fn();
	UserMock.findByIdAndUpdate = vi.fn();
	UserMock.findByIdAndDelete = vi.fn();

	return { default: UserMock };
});

vi.mock('@node-rs/argon2', () => ({
	hash: vi.fn()
}));

vi.mock('$utils/user', () => ({
	generateUsername: vi.fn()
}));

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');

	return {
		...actual,
		fail: vi.fn(),
		error: vi.fn()
	};
});

describe('Admin Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should throw error if user is not admin', async () => {
			const locals = { user: { role: 'user' } };

			try {
				await adminModule.load({ locals });
			} catch (e) {
				expect(e).toEqual(error(401, 'Only admins can access this page'));
			}
		});

		it('should return admins if user is admin', async () => {
			const locals = { user: { role: 'admin', organisation: 'org1' } };

			const mockAdmins = [
				{
					_id: '1',
					name: 'Admin1',
					email: 'admin1@example.com',
					image: 'img1',
					surname: 'Surname1',
					username: 'admin1'
				},
				{
					_id: '2',
					name: 'Admin2',
					email: 'admin2@example.com',
					image: 'img2',
					surname: 'Surname2',
					username: 'admin2'
				}
			];

			(User.find as any).mockResolvedValue(mockAdmins);

			const result = await adminModule.load({ locals });

			expect(User.find).toHaveBeenCalledWith({ role: 'admin', organisation: 'org1' });
			expect(result).toEqual({
				admins: [
					{
						id: '1',
						name: 'Admin1',
						email: 'admin1@example.com',
						image: 'img1',
						surname: 'Surname1',
						username: 'admin1'
					},
					{
						id: '2',
						name: 'Admin2',
						email: 'admin2@example.com',
						image: 'img2',
						surname: 'Surname2',
						username: 'admin2'
					}
				]
			});
		});
	});

	describe('actions.add', () => {
		it('should add a new admin successfully', async () => {
			const mockRequest = {
				formData: vi.fn().mockResolvedValue(new FormData())
			};

			const locals = { user: { role: 'admin', organisation: 'org1' } };

			(User.findOne as any).mockResolvedValue(null);
			(generateUsername as any).mockReturnValue('newadmin');
			(hash as any).mockResolvedValue('hashedPassword');
			(User as any).mockImplementation(() => ({ save: vi.fn() }));

			const result = await adminModule.actions.add({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(User).toHaveBeenCalled();
		});

		it('should fail if email already exists', async () => {
			const mockRequest = {
				formData: vi.fn().mockResolvedValue(new FormData())
			};

			const locals = { user: { role: 'admin', organisation: 'org1' } };
			(User.findOne as any).mockResolvedValue({ email: 'existing@example.com' });

			await adminModule.actions.add({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(400, { error: 'Email already in use' });
		});
	});

	describe('actions.edit', () => {
		it('should edit an admin successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');
			mockFormData.append('name', 'UpdatedName');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndUpdate as any).mockResolvedValue({ _id: '123', name: 'UpdatedName' });

			const result = await adminModule.actions.edit({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
				'123',
				{ name: 'UpdatedName', surname: null, email: null, image: null },
				{ new: true }
			);
		});

		it('should fail if admin not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndUpdate as any).mockResolvedValue(null);

			await adminModule.actions.edit({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Admin not found' });
		});
	});

	describe('actions.delete', () => {
		it('should delete an admin successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndDelete as any).mockResolvedValue({ _id: '123' });

			const result = await adminModule.actions.delete({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(User.findByIdAndDelete).toHaveBeenCalledWith('123');
		});

		it('should fail if admin not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndDelete as any).mockResolvedValue(null);

			await adminModule.actions.delete({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Admin not found' });
		});
	});
});
