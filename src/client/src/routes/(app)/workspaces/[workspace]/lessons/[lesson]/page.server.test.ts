import { error } from '@sveltejs/kit';
import { StreamClient } from '@stream-io/node-sdk';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Users from '$db/schemas/User';
import Materials from '$db/schemas/Material';
import * as LessonLoad from './+page.server';

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		error: vi.fn()
	};
});

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

describe('Stream Client Load Function', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should throw an error if Stream credentials are not set', async () => {
			vi.mock('$env/static/private', () => ({
				STREAM_API_KEY: undefined,
				STREAM_SECRET_KEY: undefined
			}));

			await expect(LessonLoad.load({ locals: {}, params: {} })).rejects.toEqual(
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

			(Materials.find as any).mockResolvedValue([
				{ _id: '1', title: 'Title', description: 'Desc' }
			]);

			(StreamClient as any).mockImplementation(() => ({
				createToken: vi.fn().mockResolvedValue(mockToken)
			}));

			const result = await LessonLoad.load({
				locals: { user: { id: '123' } },
				params: { workspace: '321' }
			});

			expect(result).toEqual({
				apiKey: 'mock-api-key',
				user: {
					id: '123',
					image: 'profile.jpg',
					name: 'John Doe'
				},
				token: mockToken,
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

			(StreamClient as any).mockImplementation(() => ({
				createToken: vi.fn().mockResolvedValue('mock-token')
			}));

			await expect(
				LessonLoad.load({ locals: { user: { id: '123' } }, params: {} })
			).rejects.toEqual(error(404, 'User not found'));
		});
	});
});
