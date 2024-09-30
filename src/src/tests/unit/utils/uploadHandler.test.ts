import { describe, it, expect, vi } from 'vitest';
import {
	uploadFile,
	multipartUploadFile,
	materialUpload,
	materialUploadFromLink
} from '$lib/server/UploadHandler';
import { upload, determineFolder } from '$lib/server/storage';
import Workspace from '$db/schemas/Workspace';
import axios from 'axios';

vi.mock('$lib/server/storage', () => ({
	upload: vi.fn(),
	determineFolder: vi.fn()
}));

vi.mock('$db/schemas/Material', () => ({
	default: class Material {
		save = vi.fn();
	}
}));

vi.mock('$db/schemas/Workspace', () => ({
	default: {
		findById: vi.fn()
	}
}));

vi.mock('axios');

describe('UploadHandler', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('uploadFile', () => {
		it('should handle pictures folder', async () => {
			determineFolder.mockReturnValue('pictures');
			upload.mockResolvedValue('file_path');
			Workspace.findById.mockResolvedValue({ _id: 'workspace_id' });
			const fileData = {
				file: 'file',
				workspace: 'workspace',
				title: 'title',
				description: 'description'
			};
			const result = await uploadFile(fileData);
			expect(upload).toHaveBeenCalledWith('file');
			expect(result).toBeDefined();
		});

		it('should throw error for unsupported folder', async () => {
			determineFolder.mockReturnValue('unsupported');
			const fileData = {
				file: 'file',
				workspace: 'workspace',
				title: 'title',
				description: 'description'
			};
			await expect(uploadFile(fileData)).rejects.toThrow('file not supported');
		});
	});

	describe('multipartUploadFile', () => {
		it('should handle pictures folder', async () => {
			Workspace.findById.mockResolvedValue({ _id: 'workspace_id' });
			const fileData = {
				link: 'link',
				workspace: 'workspace',
				title: 'title',
				description: 'description'
			};
			const result = await multipartUploadFile(fileData, 'pictures');
			expect(result).toBeDefined();
		});

		it('should throw error for unsupported folder', async () => {
			const fileData = {
				link: 'link',
				workspace: 'workspace',
				title: 'title',
				description: 'description'
			};
			await expect(multipartUploadFile(fileData, 'unsupported')).rejects.toThrow(
				'file not supported'
			);
		});
	});

	describe('materialUpload', () => {
		it('should upload file and create material', async () => {
			upload.mockResolvedValue('file_path');
			axios.post.mockResolvedValue({
				data: { body: JSON.stringify({ thumbnail_url: 'thumbnail_url' }) }
			});
			Workspace.findById.mockResolvedValue({ _id: 'workspace_id' });
			const fileData = {
				file: 'file',
				workspace: 'workspace',
				title: 'title',
				description: 'description'
			};
			const result = await materialUpload(fileData, false);
			expect(upload).toHaveBeenCalledWith('file');
			expect(result).toBeDefined();
		});
	});

	describe('materialUploadFromLink', () => {
		it('should create material from link', async () => {
			axios.post.mockResolvedValue({
				data: { body: JSON.stringify({ thumbnail_url: 'thumbnail_url' }) }
			});
			Workspace.findById.mockResolvedValue({ _id: 'workspace_id' });
			const fileData = {
				link: 'link',
				workspace: 'workspace',
				title: 'title',
				description: 'description'
			};
			const result = await materialUploadFromLink(fileData, false);
			expect(result).toBeDefined();
		});
	});
});
