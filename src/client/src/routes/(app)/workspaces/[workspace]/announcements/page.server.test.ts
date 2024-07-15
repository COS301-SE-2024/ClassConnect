import { fail, error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';

import Announcements from '$db/schemas/Announcement';
import * as announcementModule from './+page.server';

vi.mock('$db/schemas/Announcement', () => {
	const AnnouncementMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	AnnouncementMock.find = vi.fn();
	AnnouncementMock.findById = vi.fn();
	AnnouncementMock.findByIdAndUpdate = vi.fn();
	AnnouncementMock.findByIdAndDelete = vi.fn();

	return { default: AnnouncementMock };
});

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn(),
		error: vi.fn()
	};
});

describe('Announcement Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should return announcements', async () => {
			const params = { workspace: 'workspace1' };
			const mockAnnouncements = [
				{ _id: '1', date: new Date(), title: 'Title1', description: 'Desc1', createdBy: 'user1' },
				{ _id: '2', date: new Date(), title: 'Title2', description: 'Desc2', createdBy: 'user2' }
			];

			(Announcements.find as any).mockResolvedValue(mockAnnouncements);

			const result = await announcementModule.load({ params } as any);

			expect(result).toEqual({
				announcements: [
					{ id: '1', date: expect.any(String), title: 'Title1', description: 'Desc1', createdBy: 'user1' },
					{ id: '2', date: expect.any(String), title: 'Title2', description: 'Desc2', createdBy: 'user2' }
				]
			});
		});

		it('should throw error on server error', async () => {
			const params = { workspace: 'workspace1' };

			(Announcements.find as any).mockRejectedValue(new Error('Database error'));

			await expect(announcementModule.load({ params } as any)).rejects.toEqual(
				error(500, 'Error occurred while fetching announcements')
			);
		});
	});

	