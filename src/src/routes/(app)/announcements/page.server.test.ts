import { describe, it, expect, vi } from 'vitest';
import { load, actions } from './+page.server';
import { fail, error } from '@sveltejs/kit';
import {
	validateUser,
	addAnnouncement,
	getAnnouncements,
	editAnnouncement,
	deleteAnnouncement
} from '$lib/server/utils/announcements';

// Mock dependencies
vi.mock('$lib/server/utils/announcements', () => ({
	validateUser: vi.fn(),
	addAnnouncement: vi.fn(),
	getAnnouncements: vi.fn(),
	editAnnouncement: vi.fn(),
	deleteAnnouncement: vi.fn()
}));

vi.mock('@sveltejs/kit', () => ({
	fail: vi.fn(),
	error: vi.fn()
}));

describe('load function', () => {
	it('should load announcements and organisation data', async () => {
		const mockAnnouncements = [{ title: 'Announcement 1' }];
		getAnnouncements.mockResolvedValue(mockAnnouncements);

		const locals = { user: { organisation: { name: 'Org1' } } };

		const result = await load({ locals });

		expect(result).toEqual({
			announcements: mockAnnouncements,
			organisation: { name: 'Org1' }
		});
		expect(getAnnouncements).toHaveBeenCalledWith({ name: 'Org1' });
	});

	it('should handle load error', async () => {
		getAnnouncements.mockRejectedValue(new Error('Failed to fetch'));

		const locals = { user: { organisation: 'Org1' } };

		await expect(load({ locals })).rejects.toEqual(
			error(500, 'Error occurred while fetching announcements')
		);
	});
});

describe('actions.post', () => {
	it('should add an announcement successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { organisation: 'Org1' } };

		await actions.post({ request, locals });

		expect(validateUser).toHaveBeenCalledWith(locals, 'admin');
		expect(addAnnouncement).toHaveBeenCalled();
	});

	it('should fail to add an announcement and return error', async () => {
		addAnnouncement.mockRejectedValue(new Error('Add error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { organisation: 'Org1' } };

		const result = await actions.post({ request, locals });

		expect(result).toEqual(fail(500, { error: 'Failed to add announcement' }));
	});
});

describe('actions.edit', () => {
	it('should edit an announcement successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { organisation: 'Org1' } };

		await actions.edit({ request, locals });

		expect(validateUser).toHaveBeenCalledWith(locals, 'admin');
		expect(editAnnouncement).toHaveBeenCalled();
	});

	it('should fail to edit an announcement and return error', async () => {
		editAnnouncement.mockRejectedValue(new Error('Edit error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { organisation: 'Org1' } };

		const result = await actions.edit({ request, locals });

		expect(result).toEqual(fail(500, { error: 'Failed to update announcement' }));
	});
});

describe('actions.delete', () => {
	it('should delete an announcement successfully', async () => {
		const formData = new FormData();
		formData.append('id', '123');

		const request = {
			formData: vi.fn().mockResolvedValue(formData)
		};
		const locals = { user: { organisation: 'Org1' } };

		await actions.delete({ request, locals });

		expect(validateUser).toHaveBeenCalledWith(locals, 'admin');
		expect(deleteAnnouncement).toHaveBeenCalledWith('123');
	});

	it('should fail to delete an announcement and return error', async () => {
		deleteAnnouncement.mockRejectedValue(new Error('Delete error'));

		const formData = new FormData();
		formData.append('id', '123');

		const request = {
			formData: vi.fn().mockResolvedValue(formData)
		};
		const locals = { user: { organisation: 'Org1' } };

		const result = await actions.delete({ request, locals });

		expect(result).toEqual(fail(500, { error: 'Failed to remove announcement' }));
	});
});
