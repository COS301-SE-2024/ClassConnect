import { describe, it, expect, vi } from 'vitest';
import { load, actions } from './+page.server';
import { fail } from '@sveltejs/kit';
import { uploadFile, multipartUploadFile } from '$lib/server/UploadHandler';
import { getMaterials, deleteMaterial } from '$lib/server/utils/material';

// Mock dependencies
vi.mock('$lib/server/utils/material', async () => {
	return {
		getMaterials: vi.fn(),
		deleteMaterial: vi.fn()
	};
});

vi.mock('$lib/server/storage', () => ({
	determineFolderFromName: vi.fn()
}));

vi.mock('$lib/server/UploadHandler', () => ({
	uploadFile: vi.fn(),
	multipartUploadFile: vi.fn()
}));

vi.mock('$lib/server/utils', () => ({
	validateLecturer: vi.fn()
}));

vi.mock('@sveltejs/kit', () => ({
	fail: vi.fn(),
	error: vi.fn()
}));

describe('load function', () => {
	it('should load materials and return role and materials', async () => {
		const mockMaterials = [{ title: 'Test Material' }];
		getMaterials.mockResolvedValue(mockMaterials);

		const locals = { user: { role: 'lecturer' } };
		const params = { workspace: 'workspace1' };

		const result = await load({ locals, params });

		expect(result).toEqual({
			role: 'lecturer',
			materials: mockMaterials
		});
	});

	it('should throw an error if there is an issue loading materials', async () => {
		getMaterials.mockRejectedValue(new Error('DB error'));

		const locals = { user: { role: 'lecturer' } };
		const params = { workspace: 'workspace1' };

		await expect(load({ locals, params })).rejects.toThrow(
			'An unexpected error occurred while loading materials'
		);
	});
});

describe('actions.uploadMat', () => {
	it('should upload material successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};
		const params = { workspace: 'workspace1' };

		await actions.uploadMat({ request, locals, params });

		expect(uploadFile).toHaveBeenCalled();
	});

	it('should fail to upload material and return error', async () => {
		uploadFile.mockRejectedValue(new Error('Upload error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};
		const params = { workspace: 'workspace1' };

		const result = await actions.uploadMat({ request, locals, params });

		expect(result).toEqual(fail(500, { message: 'Failed to upload material' }));
	});
});

describe('actions.multiPartUploadFinal', () => {
	it('should upload multipart material successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};
		const params = { workspace: 'workspace1' };

		await actions.multiPartUploadFinal({ request, locals, params });

		expect(multipartUploadFile).toHaveBeenCalled();
	});

	it('should fail to upload multipart material and return error', async () => {
		multipartUploadFile.mockRejectedValue(new Error('Multipart upload error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};
		const params = { workspace: 'workspace1' };

		const result = await actions.multiPartUploadFinal({ request, locals, params });

		expect(result).toEqual(fail(500, { message: 'Failed to upload material' }));
	});
});

describe('actions.deleteMat', () => {
	it('should delete material successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};

		await actions.deleteMat({ request, locals });

		expect(deleteMaterial).toHaveBeenCalled();
	});

	it('should fail to delete material and return error', async () => {
		deleteMaterial.mockRejectedValue(new Error('Delete error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};

		const result = await actions.deleteMat({ request, locals });

		expect(result).toEqual(fail(500, { message: 'Failed to delete material' }));
	});
});

describe('actions.submitObjects', () => {
	it('should submit objects successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};

		const result = await actions.submitObjects({ request });

		expect(result).toEqual({
			success: true,
			message: 'Objects submitted successfully'
		});
	});
});
