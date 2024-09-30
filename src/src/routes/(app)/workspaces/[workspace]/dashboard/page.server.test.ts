import { describe, it, expect, vi } from 'vitest';
import { load } from './+page.server';
import { redirect, error } from '@sveltejs/kit';

// Mock the required functions
vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn(),
	error: vi.fn()
}));

describe('load function', () => {
	it('should redirect to /signin if the user is not signed in', async () => {
		const locals = { user: null }; // No user

		await load({ locals });

		expect(redirect).toHaveBeenCalledWith(302, '/signin');
	});

	it('should throw a 401 error if the user is not a lecturer', async () => {
		const locals = { user: { role: 'student' } }; // Not a lecturer

		await expect(load({ locals })).rejects.toThrow(error(401, 'Unauthorized'));
		expect(error).toHaveBeenCalledWith(401, 'Unauthorized');
	});

	
});
