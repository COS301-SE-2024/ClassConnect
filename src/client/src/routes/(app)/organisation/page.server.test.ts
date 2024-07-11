import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fail, error, redirect } from '@sveltejs/kit';
import User from '$db/schemas/User';
import Organisation from '$db/schemas/Organisation';
import * as organisationModule from './+page.server';

vi.mock('$db/schemas/User', () => ({
	default: {
		findByIdAndUpdate: vi.fn(),
		updateOne: vi.fn(),
		deleteMany: vi.fn()
	}
}));

vi.mock('$db/schemas/Organisation', () => ({
	default: {
		findOne: vi.fn(),
		findOneAndUpdate: vi.fn(),
		findOneAndDelete: vi.fn()
	}
}));

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn((status, data) => ({ status, data })),
		error: vi.fn((status, message) => ({ status, message })),
		redirect: vi.fn((status, location) => ({ status, location }))
	};
});

describe('Organisation Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should throw error if user is not admin', async () => {
			const locals = { user: { role: 'user' } };

			await expect(organisationModule.load({ locals })).rejects.toEqual(
				error(401, 'Only admins can access this page')
			);
		});

		it('should return null if no organisation found', async () => {
			(Organisation.findOne as any).mockResolvedValue(null);

			const result = await organisationModule.load({
				locals: { user: { id: '123', role: 'admin' } }
			});

			expect(result).toBeNull();
		});

		it('should return formatted organisation data if found', async () => {
			const mockOrg = { _id: '456', name: 'Test Org', image: 'test.jpg' };

			(Organisation.findOne as any).mockResolvedValue(mockOrg);

			const result = await organisationModule.load({
				locals: { user: { id: '123', role: 'admin' } }
			});

			expect(result).toEqual({ id: '456', name: 'Test Org', image: 'test.jpg' });
		});

		it('should throw error on server error', async () => {
			const locals = { user: { role: 'user' } };

			(Organisation.findOne as any).mockRejectedValue(new Error('DB Error'));

			await expect(organisationModule.load({ locals })).rejects.toEqual(
				error(500, 'Error occurred while fetching organisation')
			);
		});
	});

	describe('actions.create', () => {
		it('should create a new organisation successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('name', 'New Org');
			
			const mockRequest = { formData: vi.fn().mockResolvedValue(mockFormData) };
			const mockLocals = { user: { id: '123', role: 'admin' } };

			(Organisation.findOne as any).mockResolvedValue(null);
			(Organisation.prototype.save as any) = vi.fn().mockResolvedValue({});
			(User.findByIdAndUpdate as any).mockResolvedValue({});

			const result = await organisationModule.actions.create({
				request: mockRequest,
				locals: mockLocals
			} as any);
			expect(result).toEqual({ success: true });
		});

		it('should fail if organisation name is missing', async () => {
			const mockFormData = new FormData();
			const mockRequest = { formData: vi.fn().mockResolvedValue(mockFormData) };
			const mockLocals = { user: { id: '123', role: 'admin' } };

			const result = await organisationModule.actions.create({
				request: mockRequest,
				locals: mockLocals
			} as any);
			expect(result).toEqual({ status: 400, data: { error: 'Organisation Name is required' } });
		});

		it('should fail if user already has an organisation', async () => {
			const mockFormData = new FormData();
			mockFormData.append('name', 'New Org');
			const mockRequest = { formData: vi.fn().mockResolvedValue(mockFormData) };
			const mockLocals = { user: { id: '123', role: 'admin' } };

			(Organisation.findOne as any).mockResolvedValue({ _id: '456' });

			const result = await organisationModule.actions.create({
				request: mockRequest,
				locals: mockLocals
			} as any);
			expect(result).toEqual({ status: 400, data: { error: 'User already has an organisation' } });
		});
	});

	describe('actions.edit', () => {
		it('should edit an organisation successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '456');
			mockFormData.append('name', 'Updated Org');
			const mockRequest = { formData: vi.fn().mockResolvedValue(mockFormData) };
			const mockLocals = { user: { id: '123', role: 'admin' } };

			(Organisation.findOneAndUpdate as any).mockResolvedValue({ _id: '456', name: 'Updated Org' });

			const result = await organisationModule.actions.edit({
				request: mockRequest,
				locals: mockLocals
			} as any);
			expect(result).toEqual({ success: true });
		});

		it('should fail if organisation id is missing', async () => {
			const mockFormData = new FormData();
			mockFormData.append('name', 'Updated Org');
			const mockRequest = { formData: vi.fn().mockResolvedValue(mockFormData) };
			const mockLocals = { user: { id: '123', role: 'admin' } };

			const result = await organisationModule.actions.edit({
				request: mockRequest,
				locals: mockLocals
			} as any);
			expect(result).toEqual({ status: 400, data: { error: 'Organisation ID is required' } });
		});

		it('should fail if organisation is not found or not authorized', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '456');
			mockFormData.append('name', 'Updated Org');
			const mockRequest = { formData: vi.fn().mockResolvedValue(mockFormData) };
			const mockLocals = { user: { id: '123', role: 'admin' } };

			(Organisation.findOneAndUpdate as any).mockResolvedValue(null);

			const result = await organisationModule.actions.edit({
				request: mockRequest,
				locals: mockLocals
			} as any);
			expect(result).toEqual({
				status: 404,
				data: { error: 'Organisation not found or not authorized' }
			});
		});
	});

	describe('actions.delete', () => {
		it('should delete an organisation successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '456');
			const mockRequest = { formData: vi.fn().mockResolvedValue(mockFormData) };
			const mockLocals = { user: { id: '123', role: 'admin' } };

			(Organisation.findOneAndDelete as any).mockResolvedValue({ _id: '456' });
			(User.updateOne as any).mockResolvedValue({});
			(User.deleteMany as any).mockResolvedValue({});

			const result = await organisationModule.actions.delete({
				request: mockRequest,
				locals: mockLocals
			} as any);
			expect(result).toEqual({ success: true });
		});

		it('should fail if organisation id is missing', async () => {
			const mockFormData = new FormData();
			const mockRequest = { formData: vi.fn().mockResolvedValue(mockFormData) };
			const mockLocals = { user: { id: '123', role: 'admin' } };

			const result = await organisationModule.actions.delete({
				request: mockRequest,
				locals: mockLocals
			} as any);
			expect(result).toEqual({ status: 400, data: { error: 'Organisation ID is required' } });
		});

		it('should fail if organisation is not found or not authorized', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '456');
			const mockRequest = { formData: vi.fn().mockResolvedValue(mockFormData) };
			const mockLocals = { user: { id: '123', role: 'admin' } };

			(Organisation.findOneAndDelete as any).mockResolvedValue(null);

			const result = await organisationModule.actions.delete({
				request: mockRequest,
				locals: mockLocals
			} as any);
			expect(result).toEqual({
				status: 404,
				data: { error: 'Organisation not found or not authorized' }
			});
		});
	});
});
