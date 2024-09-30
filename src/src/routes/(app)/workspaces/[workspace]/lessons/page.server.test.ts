import { describe, it, expect, vi } from 'vitest';
import { load, actions } from './+page.server';
import { fail } from '@sveltejs/kit';
import {
	getLessons,
	getRecordings,
	scheduleLesson,
	editLesson,
	deleteLesson,
	deleteRecording
} from '$lib/server/utils/lessons';

// Mock dependencies
vi.mock('$lib/server/utils', () => ({
	validateLecturer: vi.fn()
}));

vi.mock('$lib/server/utils/lessons', async () => {
	return {
		getLessons: vi.fn(),
		getRecordings: vi.fn(),
		scheduleLesson: vi.fn(),
		editLesson: vi.fn(),
		deleteLesson: vi.fn(),
		deleteRecording: vi.fn()
	};
});

vi.mock('@sveltejs/kit', () => ({
	fail: vi.fn(),
	error: vi.fn()
}));

describe('load function', () => {
	it('should load lessons and recordings and return role, lessons, and recordings', async () => {
		const mockLessons = [{ title: 'Test Lesson' }];
		const mockRecordings = [{ title: 'Test Recording' }];
		getLessons.mockResolvedValue(mockLessons);
		getRecordings.mockResolvedValue(mockRecordings);

		const locals = { user: { role: 'lecturer' } };
		const params = { workspace: 'workspace1' };

		const result = await load({ locals, params });

		expect(result).toEqual({
			role: 'lecturer',
			lessons: mockLessons,
			recordings: mockRecordings
		});
	});

	it('should throw an error if there is an issue loading lessons or recordings', async () => {
		getLessons.mockRejectedValue(new Error('DB error'));
		getRecordings.mockRejectedValue(new Error('DB error'));

		const locals = { user: { role: 'lecturer' } };
		const params = { workspace: 'workspace1' };

		await expect(load({ locals, params })).rejects.toThrow(
			'An unexpected error occurred while loading lessons'
		);
	});
});

describe('actions.schedule', () => {
	it('should schedule a lesson successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};
		const params = { workspace: 'workspace1' };

		await actions.schedule({ request, locals, params });

		expect(scheduleLesson).toHaveBeenCalled();
	});

	it('should fail to schedule a lesson and return error', async () => {
		scheduleLesson.mockRejectedValue(new Error('Schedule error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};
		const params = { workspace: 'workspace1' };

		const result = await actions.schedule({ request, locals, params });

		expect(result).toEqual(fail(500, { message: 'Failed to create lesson' }));
	});
});

describe('actions.edit', () => {
	it('should edit a lesson successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};

		await actions.edit({ request, locals });

		expect(editLesson).toHaveBeenCalled();
	});
	it('should fail to edit a lesson and return error', async () => {
		editLesson.mockRejectedValue(new Error('Edit error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};

		const result = await actions.edit({ request, locals });

		expect(result).toEqual(fail(500, { error: 'Failed to update lesson' }));
	});
});

describe('actions.delete', () => {
	it('should delete a lesson successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};

		await actions.delete({ request, locals });

		expect(deleteLesson).toHaveBeenCalled();
	});

	it('should fail to delete a lesson and return error', async () => {
		deleteLesson.mockRejectedValue(new Error('Delete error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};

		const result = await actions.delete({ request, locals });

		expect(result).toEqual(fail(500, { message: 'Failed to delete lesson' }));
	});
});

describe('actions.deleteRecording', () => {
	it('should delete a recording successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};

		await actions.deleteRecording({ request, locals });

		expect(deleteRecording).toHaveBeenCalled();
	});

	it('should fail to delete a recording and return error', async () => {
		deleteRecording.mockRejectedValue(new Error('Delete recording error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};

		const result = await actions.deleteRecording({ request, locals });

		expect(result).toEqual(fail(500, { message: 'Failed to delete lesson' }));
	});
});
