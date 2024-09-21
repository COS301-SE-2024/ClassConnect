import { describe, it, expect, vi } from 'vitest';
import { formatMaterial } from '$lib/server/utils/material'; // Adjust the import path as necessary

vi.mock('@sveltejs/kit', () => ({
    fail: vi.fn()
}));

vi.mock('$lib/server/storage', () => ({
	deleteFile: vi.fn()
}));

vi.mock('$db/schemas/Material', () => {
	const LessonMock = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	LessonMock.findById = vi.fn();
	return { default: LessonMock };
});

describe('formatMaterial', () => {
    it('should format material correctly', () => {
        const material = {
            title: 'Test Title',
            description: 'Test Description',
            file_path: '/path/to/file',
            thumbnail: '/path/to/thumbnail',
            type: 'pdf',
            _id: '12345'
        };

        const formatted = formatMaterial(material);

        expect(formatted).toEqual({
            title: 'Test Title',
            description: 'Test Description',
            file_path: '/path/to/file',
            thumbnail: '/path/to/thumbnail',
            type: 'pdf',
            id: '12345'
        });
    });
});
