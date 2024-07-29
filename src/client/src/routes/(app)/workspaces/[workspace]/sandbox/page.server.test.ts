import { error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Materials from '$db/schemas/Material';
import * as materialModule from './+page.server';

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn(),
		error: vi.fn()
	};
});

vi.mock('$db/schemas/Material', () => {
	const MaterialMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	MaterialMock.find = vi.fn();
	return { default: MaterialMock };
});

describe('Material Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should return materials', async () => {
			const params = { workspace: 'workspace1' };
			const mockMaterials = [
				{ title: 'TestedObject1', description: 'Desc1', file_path: 'bogusPath1', type: true },
				{ title: 'TestedObject2', description: 'Desc2', file_path: 'bogusPath2', type: true }
			];
			(Materials.find as any).mockResolvedValue(mockMaterials);

			const result = await materialModule.load({ params } as any);

			expect(result).toEqual({
				materials: [
					{ title: 'TestedObject1', description: 'Desc1', file_path: 'bogusPath1' },
					{ title: 'TestedObject2', description: 'Desc2', file_path: 'bogusPath2' }
				]
			});

			expect(Materials.find).toHaveBeenCalledWith({ workspace_id: 'workspace1', type: true });
		});

		it('should return an empty array when no materials match the type', async () => {
			const params = { workspace: 'workspace1' };
			(Materials.find as any).mockResolvedValue([]);

			const result = await materialModule.load({ params } as any);

			expect(result).toEqual({ materials: [] });
			expect(Materials.find).toHaveBeenCalledWith({ workspace_id: 'workspace1', type: true });
		});

		it('should throw error on server error', async () => {
			const params = { workspace: 'workspace1' };
			(Materials.find as any).mockRejectedValue(new Error('Database error'));

			await expect(materialModule.load({ params } as any)).rejects.toEqual(
				error(500, 'An unexpected error occurred while loading lessons')
			);
		});
	});
});
