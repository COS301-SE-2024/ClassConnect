
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

	describe('actions.post', () => {
		it('should create a new announcement successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('title', 'New Title');
			mockFormData.append('description', 'New Description');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer', id: 'user1' } };
			const params = { workspace: 'workspace1' };

			const mockAnnouncement = { save: vi.fn() };
			(Announcements as any).mockImplementation(() => mockAnnouncement);

			const result = await announcementModule.actions.post({
				request: mockRequest,
				locals,
				params
			} as any);

			expect(result).toEqual({ success: true });
			expect(Announcements).toHaveBeenCalledWith({
				title: 'New Title',
				description: 'New Description',
				createdBy: 'user1',
				owner: expect.any(mongoose.Types.ObjectId)
			});
			expect(mockAnnouncement.save).toHaveBeenCalled();
		});

		it('should fail if user is not a lecturer', async () => {
			const locals = { user: { role: 'student' } };

			await expect(announcementModule.actions.post({ locals } as any)).rejects.toEqual(
				error(401, 'Unauthorised')
			);
		});

		it('should fail if required fields are missing', async () => {
			const mockFormData = new FormData();
			mockFormData.append('title', 'New Title');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };
			const params = { workspace: 'workspace1' };

			await announcementModule.actions.post({
				request: mockRequest,
				locals,
				params
			} as any);

			expect(fail).toHaveBeenCalledWith(500, { error: 'Failed to post announcement' });
		});
	});

	