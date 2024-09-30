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
	it('should load announcements and user data successfully', async () => {
		const mockAnnouncements = [{ title: 'Announcement 1' }];
		getAnnouncements.mockResolvedValue(mockAnnouncements);

		const locals = { user: { id: 1, role: 'lecturer' } };
		const params = { workspace: 'workspace1' };

		const result = await load({ locals, params });

		expect(result).toEqual({
			announcements: mockAnnouncements,
			id: '1',
			role: 'lecturer'
		});
		expect(getAnnouncements).toHaveBeenCalledWith('workspace1');
	});

	it('should throw an error if fetching announcements fails', async () => {
		getAnnouncements.mockRejectedValue(new Error('Fetch error'));

		const locals = { user: { id: 1, role: 'lecturer' } };
		const params = { workspace: 'workspace1' };

		await expect(load({ locals, params })).rejects.toThrow(
			error(500, 'Error occurred while fetching announcements')
		);
		expect(getAnnouncements).toHaveBeenCalledWith('workspace1');
	});
});

describe('actions.post', () => {
	it('should successfully add an announcement', async () => {
		const formDataMock = new FormData();
		const request = { formData: vi.fn().mockResolvedValue(formDataMock) };
		const locals = { user: { role: 'lecturer' } };
		const params = { workspace: 'workspace1' };

		await actions.post({ request, locals, params });

		expect(validateUser).toHaveBeenCalledWith(locals, 'lecturer');
		expect(addAnnouncement).toHaveBeenCalledWith(formDataMock, 'workspace1');
	});

	it('should fail to add announcement if there is an error', async () => {
		addAnnouncement.mockRejectedValue(new Error('Add error'));

		const formDataMock = new FormData();
		const request = { formData: vi.fn().mockResolvedValue(formDataMock) };
		const locals = { user: { role: 'lecturer' } };
		const params = { workspace: 'workspace1' };

		const result = await actions.post({ request, locals, params });

		expect(result).toEqual(fail(500, { error: 'Failed to add announcement' }));
		expect(validateUser).toHaveBeenCalledWith(locals, 'lecturer');
	});
});

describe('actions.edit', () => {
	it('should successfully edit an announcement', async () => {
		const formDataMock = new FormData();
		const request = { formData: vi.fn().mockResolvedValue(formDataMock) };
		const locals = { user: { role: 'lecturer' } };

		await actions.edit({ request, locals });

		expect(validateUser).toHaveBeenCalledWith(locals, 'lecturer');
		expect(editAnnouncement).toHaveBeenCalledWith(formDataMock);
	});

	it('should fail to edit an announcement if there is an error', async () => {
		editAnnouncement.mockRejectedValue(new Error('Edit error'));

		const formDataMock = new FormData();
		const request = { formData: vi.fn().mockResolvedValue(formDataMock) };
		const locals = { user: { role: 'lecturer' } };

		const result = await actions.edit({ request, locals });

		expect(result).toEqual(fail(500, { error: 'Failed to update announcement' }));
		expect(validateUser).toHaveBeenCalledWith(locals, 'lecturer');
	});
});

describe('actions.delete', () => {
	it('should successfully delete an announcement', async () => {
		const formDataMock = new FormData();
		formDataMock.append('id', 'announcement-id');
		const request = { formData: vi.fn().mockResolvedValue(formDataMock) };
		const locals = { user: { role: 'lecturer' } };

		await actions.delete({ request, locals });

		expect(validateUser).toHaveBeenCalledWith(locals, 'lecturer');
		expect(deleteAnnouncement).toHaveBeenCalledWith('announcement-id');
	});

	it('should fail to delete an announcement if there is an error', async () => {
		deleteAnnouncement.mockRejectedValue(new Error('Delete error'));

		const formDataMock = new FormData();
		formDataMock.append('id', 'announcement-id');
		const request = { formData: vi.fn().mockResolvedValue(formDataMock) };
		const locals = { user: { role: 'lecturer' } };

		const result = await actions.delete({ request, locals });

		expect(result).toEqual(fail(500, { error: 'Failed to remove announcement' }));
		expect(validateUser).toHaveBeenCalledWith(locals, 'lecturer');
	});
});
