import { fail, error, redirect } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import User from '$db/schemas/User';
import Workspace from '$db/schemas/Workspace';
import * as workspaceModule from './+page.server';

vi.mock('$db/schemas/User', () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	UserMock.find = vi.fn();
	UserMock.findById = vi.fn();
	UserMock.findByIdAndUpdate = vi.fn();
	UserMock.updateMany = vi.fn();

	return { default: UserMock };
});

vi.mock('$db/schemas/Workspace', () => {
	const WorkspaceMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	WorkspaceMock.find = vi.fn();
	WorkspaceMock.findById = vi.fn();
	WorkspaceMock.findByIdAndDelete = vi.fn();

	return { default: WorkspaceMock };
});

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn(),
		error: vi.fn(),
		redirect: vi.fn()
	};
});

describe('Workspace Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should redirect if user is not authenticated', async () => {
			const locals = { user: null };

			await workspaceModule.load({ locals } as any);

			expect(redirect).toHaveBeenCalledWith(302, '/signin');
		});

		it('should return workspaces and lecturers for admin users', async () => {
			const locals = { user: { role: 'admin', organisation: 'org1' } };
			const mockWorkspaces = [
				{ _id: '1', name: 'Workspace1', image: 'img1', owner: 'owner1' },
				{ _id: '2', name: 'Workspace2', image: 'img2', owner: 'owner2' }
			];
			const mockLecturers = [
				{ _id: '1', name: 'Lecturer1', surname: 'Surname1' },
				{ _id: '2', name: 'Lecturer2', surname: 'Surname2' }
			];

			const mockOwner = { name: 'TestName', surname: 'TestSurname' };

			(Workspace.find as any).mockResolvedValue(mockWorkspaces);
			(User.findById as any).mockReturnValue({ select: vi.fn().mockResolvedValue(mockOwner) });
			(User.find as any).mockReturnValue({ select: vi.fn().mockResolvedValue(mockLecturers) });

			const result = await workspaceModule.load({ locals } as any);

			expect(result).toEqual({
				organisation: 'org1',
				role: 'admin',
				lecturers: [
					{ id: '1', name: 'Lecturer1', surname: 'Surname1' },
					{ id: '2', name: 'Lecturer2', surname: 'Surname2' }
				],
				workspaces: [
					{
						id: '1',
						name: 'Workspace1',
						image: 'img1',
						description: '',
						owner: 'TestName TestSurname'
					},
					{
						id: '2',
						name: 'Workspace2',
						image: 'img2',
						description: '',
						owner: 'TestName TestSurname'
					}
				]
			});
		});

		it('should return workspaces for non-admin users', async () => {
			const locals = { user: { id: 'user1', role: 'lecturer' } };
			const mockUser = { workspaces: ['1', '2'] };
			const mockWorkspaces = [
				{ _id: '1', name: 'Workspace1', image: 'img1', description: 'Desc1' },
				{ _id: '2', name: 'Workspace2', image: 'img2', description: 'Desc2' }
			];

			(User.findById as any).mockImplementation(() => ({
				select: () => Promise.resolve(mockUser)
			}));
			(Workspace.find as any).mockResolvedValue(mockWorkspaces);

			const result = await workspaceModule.load({ locals } as any);

			expect(result).toEqual({
				workspaces: [
					{ id: '1', name: 'Workspace1', owner: '', image: 'img1', description: 'Desc1' },
					{ id: '2', name: 'Workspace2', owner: '', image: 'img2', description: 'Desc2' }
				]
			});
		});
	});

	describe('actions.create', () => {
		it('should create a new workspace successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('name', 'New Workspace');
			mockFormData.append('owner', 'owner1');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin', organisation: 'org1' } };

			const mockUser = { workspaces: [], save: vi.fn() };
			(User.findById as any).mockResolvedValue(mockUser);

			const mockWorkspace = { save: vi.fn() };
			(Workspace as any).mockImplementation(() => mockWorkspace);

			const result = await workspaceModule.actions.create({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(Workspace).toHaveBeenCalledWith({
				name: 'New Workspace',
				owner: 'owner1',
				organisation: 'org1',
				image: '/images/organisation-placeholder.png'
			});
			expect(mockWorkspace.save).toHaveBeenCalled();
		});

		it('should fail if user is not admin', async () => {
			const locals = { user: { role: 'lecturer' } };

			await expect(workspaceModule.actions.create({ locals } as any)).rejects.toEqual(
				error(401, 'Unauthorised')
			);
		});
	});

	describe('actions.edit', () => {
		it('should edit a workspace successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');
			mockFormData.append('name', 'Updated Workspace');
			mockFormData.append('owner', 'newowner');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };

			const mockWorkspace = {
				name: 'Old Workspace',
				owner: 'oldowner',
				save: vi.fn()
			};
			(Workspace.findById as any).mockResolvedValue(mockWorkspace);
			(User.findByIdAndUpdate as any).mockResolvedValue({});

			const result = await workspaceModule.actions.edit({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(mockWorkspace.name).toBe('Updated Workspace');
			expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(2);
		});

		it('should fail if workspace not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(Workspace.findById as any).mockResolvedValue(null);

			await workspaceModule.actions.delete({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Workspace not found' });
		});
	});

	describe('actions.delete', () => {
		it('should delete a workspace successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			const mockDeletedWorkspace = { _id: '123', owner: 'owner1' };
			(Workspace.findByIdAndDelete as any).mockResolvedValue(mockDeletedWorkspace);
			(User.findByIdAndUpdate as any).mockResolvedValue({});
			(User.updateMany as any).mockResolvedValue({});

			const result = await workspaceModule.actions.delete({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(Workspace.findByIdAndDelete).toHaveBeenCalledWith('123');
			expect(User.findByIdAndUpdate).toHaveBeenCalledWith('owner1', {
				$pull: { workspaces: '123' }
			});
			expect(User.updateMany).toHaveBeenCalledWith(
				{ workspaces: '123' },
				{ $pull: { workspaces: '123' } }
			);
		});

		it('should fail if workspace not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };
			(Workspace.findByIdAndDelete as any).mockResolvedValue(null);

			await workspaceModule.actions.delete({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Workspace not found' });
		});
	});
});
