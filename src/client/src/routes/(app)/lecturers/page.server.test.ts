import { hash } from '@node-rs/argon2';
import { fail, error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import User from '$db/schemas/User';
import * as lecturerModule from './+page.server';
import { generateUsername } from '$utils/user';

vi.mock('$db/schemas/User', () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({}));

	UserMock.find = vi.fn();
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

describe('Lecturer Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should throw error if user is not admin', async () => {
			const locals = { user: { role: 'user' } };

			try {
				await lecturerModule.load({ locals });
			} catch (e) {
				expect(e).toEqual(error(401, 'Only admins can access this page'));
			}
		});

		it('should return lecturers if user is admin', async () => {
			const locals = { user: { role: 'admin', organisation: 'org1' } };

			const mockLecturers = [
				{
					_id: '1',
					name: 'Lecturer1',
					email: 'lecturer1@example.com',
					image: 'img1',
					surname: 'Surname1',
					username: 'lecturer1'
				},
				{
					_id: '2',
					name: 'Lecturer2',
					email: 'lecturer2@example.com',
					image: 'img2',
					surname: 'Surname2',
					username: 'lecturer2'
				}
			];

			(User.find as any).mockResolvedValue(mockLecturers);

			const result = await lecturerModule.load({ locals });

			expect(User.find).toHaveBeenCalledWith({ role: 'lecturer', organisation: 'org1' });
			expect(result).toEqual({
				lecturers: [
					{
						id: '1',
						name: 'Lecturer1',
						email: 'lecturer1@example.com',
						image: 'img1',
						surname: 'Surname1',
						username: 'lecturer1'
					},
					{
						id: '2',
						name: 'Lecturer2',
						email: 'lecturer2@example.com',
						image: 'img2',
						surname: 'Surname2',
						username: 'lecturer2'
					}
				]
			});
		});
	});

	describe('actions.add', () => {
		it('should add a new lecturer successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('name', 'New Lecturer');
			mockFormData.append('email', 'newlecturer@example.com');
			mockFormData.append('surname', 'Surname');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin', organisation: 'org1' } };

			(User.findOne as any).mockResolvedValue(null);
			(generateUsername as any).mockReturnValue('newLecturer');
			(hash as any).mockResolvedValue('hashedPassword');
			(User as any).mockImplementation(() => ({ save: vi.fn() }));

			const result = await lecturerModule.actions.add({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(User).toHaveBeenCalled();
		});

		it('should fail if email already exists', async () => {
			const mockFormData = new FormData();
			mockFormData.append('email', 'existing@example.com');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin', organisation: 'org1' } };
			(User.findOne as any).mockResolvedValue({ email: 'existing@example.com' });

			await lecturerModule.actions.add({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(400, { error: 'Email already in use' });
		});
	});

	describe('actions.edit', () => {
		it('should edit a lecturer successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');
			mockFormData.append('name', 'UpdatedName');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndUpdate as any).mockResolvedValue({ _id: '123', name: 'UpdatedName' });

			const result = await lecturerModule.actions.edit({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
				'123',
				{ name: 'UpdatedName', email: null, image: null, surname: null },
				{ new: true }
			);
		});

		it('should fail if lecturer not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndUpdate as any).mockResolvedValue(null);

			await lecturerModule.actions.edit({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Lecturer not found' });
		});
	});

	describe('actions.delete', () => {
		it('should delete a lecturer successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndDelete as any).mockResolvedValue({ _id: '123' });

			const result = await lecturerModule.actions.delete({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(User.findByIdAndDelete).toHaveBeenCalledWith('123');
		});

		it('should fail if lecturer not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndDelete as any).mockResolvedValue(null);

			await lecturerModule.actions.delete({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Lecturer not found' });
		});
	});
});
