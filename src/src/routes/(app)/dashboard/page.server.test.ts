import { describe, it, expect, vi } from 'vitest';
import { load } from './+page.server';
import { error } from '@sveltejs/kit';

// Mock the required functions
vi.mock('@sveltejs/kit', () => ({
	error: vi.fn()
}));

describe('load function', () => {
	it('should throw a 401 error if the user is neither admin nor student', async () => {
		const locals = { user: { role: 'lecturer' } }; // Invalid role

		await expect(load({ locals })).rejects.toThrow(error(401, 'Unauthorised'));
		expect(error).toHaveBeenCalledWith(401, 'Unauthorised');
	});

	it('should return role and organisation if the user is an admin', async () => {
		const locals = { user: { role: 'admin', organisation: { name: 'Org1' } } }; // Admin

		const result = await load({ locals });

		expect(result).toEqual({
			role: 'admin',
			organisation: { name: 'Org1' }
		});
	});

	it('should return role and organisation if the user is a student', async () => {
		const locals = { user: { role: 'student', organisation: { name: 'Org1' } } }; // Student

		const result = await load({ locals });

		expect(result).toEqual({
			role: 'student',
			organisation: { name: 'Org1' }
		});
	});

	it('should return role without organisation if no organisation exists', async () => {
		const locals = { user: { role: 'admin' } }; // Admin with no organisation

		const result = await load({ locals });

		expect(result).toEqual({
			role: 'admin',
			organisation: undefined
		});
	});
});
