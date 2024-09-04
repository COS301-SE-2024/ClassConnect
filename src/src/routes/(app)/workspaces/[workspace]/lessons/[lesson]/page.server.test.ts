import { error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fail } from '@sveltejs/kit';
import Users from '$db/schemas/User';
import { actions, load } from './+page.server';
import { validateLecturer } from '$lib/server/utils';
import { getMaterials } from '$lib/server/utils/material';
import { saveRecording, saveRecordingLink, tokenProvider } from '$lib/server/utils/lesson';

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		error: vi.fn(),
		fail: vi.fn()
	};
});

vi.mock('$lib/server/storage', () => ({
	upload: vi.fn(),
	deleteFile: vi.fn()
}));

vi.mock('@stream-io/node-sdk', () => ({
	StreamClient: vi.fn().mockImplementation(() => ({
		createToken: vi.fn()
	}))
}));

vi.mock('$db/schemas/User', () => ({
	default: {
		findById: vi.fn()
	}
}));

vi.mock('$db/schemas/Recording', () => ({
	default: {
		find: vi.fn()
	}
}));

vi.mock('$db/schemas/Lesson', () => ({
	default: {
		findById: vi.fn()
	}
}));

vi.mock('$db/schemas/Material', () => ({
	default: {
		find: vi.fn()
	}
}));

vi.mock('$lib/server/utils/material', () => ({
	getMaterials: vi.fn()
}));

vi.mock('$lib/server/utils', () => ({
	validateLecturer: vi.fn()
}));

vi.mock('$lib/server/utils/lesson', () => ({
	saveRecording: vi.fn(),
	saveRecordingLink: vi.fn(),
	tokenProvider: vi.fn()
}));

describe('load function', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should throw an error if Stream credentials are not set', async () => {
		vi.mock('$env/static/private', () => ({
			STREAM_API_KEY: undefined,
			STREAM_SECRET_KEY: undefined
		}));

		await expect(load({ locals: {}, params: {} })).rejects.toEqual(
			error(403, 'Stream credentials not set')
		);
	});

	it('should return the correct data', async () => {
		vi.mock('$env/static/private', () => ({
			STREAM_API_KEY: 'mock-api-key',
			STREAM_SECRET_KEY: 'mock-secret-key'
		}));

		const mockUser = {
			id: '123',
			name: 'John',
			surname: 'Doe',
			image: 'profile.jpg'
		};

		const mockToken = 'mock-token';

		(Users.findById as any).mockReturnValue({
			select: vi.fn().mockResolvedValue(mockUser)
		});

		(getMaterials as any).mockResolvedValue([{ id: '1', title: 'Title', description: 'Desc' }]);

		(tokenProvider as any).mockResolvedValue(mockToken);

		const result = await load({
			locals: { user: { id: '123', role: 'lecturer' } },
			params: { workspace: '321' }
		});

		expect(result).toEqual({
			token: mockToken,
			apiKey: 'mock-api-key',
			user: {
				id: '123',
				image: 'profile.jpg',
				name: 'John Doe'
			},
			role: 'lecturer',
			materials: [
				{
					id: '1',
					title: 'Title',
					description: 'Desc'
				}
			]
		});
	});

	it('should handle the case when user is not found', async () => {
		vi.mock('$env/static/private', () => ({
			STREAM_API_KEY: 'mock-api-key',
			STREAM_SECRET_KEY: 'mock-secret-key'
		}));

		(Users.findById as any).mockReturnValue({
			select: vi.fn().mockResolvedValue(null)
		});

		await expect(load({ locals: { user: { id: '123' } }, params: {} })).rejects.toEqual(
			error(404, 'User not found')
		);
	});
});

describe('actions.SaveRecording', () => {
	it('should save recording successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { id: 'user-id', role: 'lecturer' } };

		validateLecturer.mockImplementation(() => {});

		const mockResponse = { id: 'recording-id' };
		saveRecording.mockResolvedValue(mockResponse);

		const result = await actions.SaveRecording({ request, locals });

		expect(result).toEqual(mockResponse);
		expect(validateLecturer).toHaveBeenCalledWith(locals);
		expect(saveRecording).toHaveBeenCalledWith(expect.any(FormData));
	});

	it('should fail to save recording and return error', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { id: 'user-id', role: 'lecturer' } };

		validateLecturer.mockImplementation(() => {});

		saveRecording.mockRejectedValue(new Error('Save error'));

		const result = await actions.SaveRecording({ request, locals });

		expect(result).toEqual(fail(500, { message: 'Failed to save recording' }));
		expect(validateLecturer).toHaveBeenCalledWith(locals);
	});
});

describe('actions.SaveRecordingLink', () => {
	it('should save recording link successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { id: 'user-id', role: 'lecturer' } };

		validateLecturer.mockImplementation(() => {});

		const mockResponse = { id: 'recording-link-id' };
		saveRecordingLink.mockResolvedValue(mockResponse);

		const result = await actions.SaveRecordingLink({ request, locals });

		expect(result).toEqual(mockResponse);
		expect(validateLecturer).toHaveBeenCalledWith(locals);
		expect(saveRecordingLink).toHaveBeenCalledWith(expect.any(FormData));
	});

	it('should fail to save recording link and return error', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { id: 'user-id', role: 'lecturer' } };

		validateLecturer.mockImplementation(() => {});

		saveRecordingLink.mockRejectedValue(new Error('Save error'));

		const result = await actions.SaveRecordingLink({ request, locals });

		expect(result).toEqual(fail(500, { message: 'Failed to save recording' }));
		expect(validateLecturer).toHaveBeenCalledWith(locals);
	});
});
