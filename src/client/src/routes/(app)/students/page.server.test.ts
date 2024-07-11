import { hash } from '@node-rs/argon2';
import { fail, error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import User from '$db/schemas/User';
import Workspace from '$db/schemas/Workspace';
import { generateUsername } from '$utils/user';
import * as studentModule from './+page.server';

vi.mock('$db/schemas/User', () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({}));

	UserMock.find = vi.fn();
	UserMock.findOne = vi.fn();
	UserMock.findByIdAndUpdate = vi.fn();
	UserMock.findByIdAndDelete = vi.fn();

	return { default: UserMock };
});

vi.mock('$db/schemas/Workspace', () => {
	const WorkspaceMock: any = vi.fn().mockImplementation(() => ({}));

	WorkspaceMock.find = vi.fn();

	return { default: WorkspaceMock };
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

describe('Student Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should throw error if user is not admin', async () => {
			const locals = { user: { role: 'user' } };

			await expect(studentModule.load({ locals })).rejects.toEqual(
				error(401, 'Only admins can access this page')
			);
		});

		it('should return students and workspaces if user is admin', async () => {
			const locals = { user: { role: 'admin', organisation: 'org1' } };

			const mockStudents = [
				{
					_id: '1',
					name: 'Student1',
					email: 'student1@example.com',
					image: 'img1',
					surname: 'Surname1',
					username: 'student1'
				},
				{
					_id: '2',
					name: 'Student2',
					email: 'student2@example.com',
					image: 'img2',
					surname: 'Surname2',
					username: 'student2'
				}
			];

			const mockWorkspaces = [
				{
					_id: '1',
					name: 'Workspace1',
					image: 'img1',
					description: 'Description1'
				},
				{
					_id: '2',
					name: 'Workspace2',
					image: 'img2',
					description: 'Description2'
				}
			];

			(User.find as any).mockResolvedValue(mockStudents);
			(Workspace.find as any).mockResolvedValue(mockWorkspaces);

			const result = await studentModule.load({ locals });

			expect(User.find).toHaveBeenCalledWith({ role: 'student', organisation: 'org1' });
			expect(Workspace.find).toHaveBeenCalledWith({ organisation: 'org1' });
			expect(result).toEqual({
				students: [
					{
						id: '1',
						name: 'Student1',
						email: 'student1@example.com',
						image: 'img1',
						surname: 'Surname1',
						username: 'student1'
					},
					{
						id: '2',
						name: 'Student2',
						email: 'student2@example.com',
						image: 'img2',
						surname: 'Surname2',
						username: 'student2'
					}
				],
				workspaces: [
					{
						id: '1',
						name: 'Workspace1',
						owner: '',
						image: 'img1',
						description: 'Description1'
					},
					{
						id: '2',
						name: 'Workspace2',
						owner: '',
						image: 'img2',
						description: 'Description2'
					}
				]
			});
		});
	});

	describe('actions.add', () => {
		it('should add a new student successfully', async () => {
			const mockFormData = new FormData();

			mockFormData.append('name', 'New Student');
			mockFormData.append('email', 'newstudent@example.com');
			mockFormData.append('surname', 'Surname');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin', organisation: 'org1' } };

			(User.findOne as any).mockResolvedValue(null);
			(generateUsername as any).mockReturnValue('newStudent');
			(hash as any).mockResolvedValue('hashedPassword');
			(User as any).mockImplementation(() => ({ save: vi.fn() }));

			const result = await studentModule.actions.add({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(User).toHaveBeenCalledWith({
				name: 'New Student',
				email: 'newstudent@example.com',
				surname: 'Surname',
				username: 'newStudent',
				organisation: 'org1',
				role: 'student',
				password: 'hashedPassword',
				image: 'images/profile-placeholder.png'
			});
		});

		it('should fail if email already exists', async () => {
			const mockFormData = new FormData();
			mockFormData.append('email', 'existing@example.com');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin', organisation: 'org1' } };
			(User.findOne as any).mockResolvedValue({ email: 'existing@example.com' });

			await studentModule.actions.add({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(400, { error: 'Email already in use' });
		});
	});

	describe('actions.edit', () => {
		it('should edit a student successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');
			mockFormData.append('name', 'UpdatedName');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndUpdate as any).mockResolvedValue({ _id: '123', name: 'UpdatedName' });

			const result = await studentModule.actions.edit({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
				'123',
				{ name: 'UpdatedName', email: null, image: null, surname: null },
				{ new: true }
			);
		});

		it('should fail if student not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndUpdate as any).mockResolvedValue(null);

			await studentModule.actions.edit({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Student not found' });
		});
	});

	describe('actions.delete', () => {
		it('should delete a student successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndDelete as any).mockResolvedValue({ _id: '123' });

			const result = await studentModule.actions.delete({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(User.findByIdAndDelete).toHaveBeenCalledWith('123');
		});

		it('should fail if student not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndDelete as any).mockResolvedValue(null);

			await studentModule.actions.delete({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Student not found' });
		});
	});

	describe('actions.enrol', () => {
		it('should enrol a student in workspaces successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');
			mockFormData.append('workspaces', 'workspace1');
			mockFormData.append('workspaces', 'workspace2');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndUpdate as any).mockResolvedValue({
				_id: '123',
				workspaces: ['workspace1', 'workspace2']
			});

			const result = await studentModule.actions.enrol({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
				'123',
				{ $addToSet: { workspaces: { $each: ['workspace1', 'workspace2'] } } },
				{ new: true, runValidators: true }
			);
		});

		it('should fail if student not found during enrolment', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');
			mockFormData.append('workspaces', 'workspace1');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(User.findByIdAndUpdate as any).mockResolvedValue(null);

			await studentModule.actions.enrol({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Student not found' });
		});
	});
});
