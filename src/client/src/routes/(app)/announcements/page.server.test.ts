import type { ObjectId } from 'mongoose';
import { fail, error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Announcements from '$db/schemas/Announcement';
import * as announcementModule from './+page.server';

vi.mock('$db/schemas/Announcement', () => {
	const AnnouncementMock: any = vi.fn().mockImplementation(() => ({}));

	AnnouncementMock.find = vi.fn();
	AnnouncementMock.findOne = vi.fn();
	AnnouncementMock.findOne = vi.fn();
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
		it('should return announcements if user is logged in', async () => {
			const locals = { user: { organisation: 'org1' as unknown as ObjectId } };

			const mockAnnouncements = [
				{
					_id: '1',
					title: 'Announcement 1',
					description: 'Description 1',
					date: new Date('2023-01-01'),
					createdBy: 'user1'
				},
				{
					_id: '2',
					title: 'Announcement 2',
					description: 'Description 2',
					date: new Date('2023-01-02'),
					createdBy: 'user2'
				}
			];

			(Announcements.find as any).mockResolvedValue(mockAnnouncements);

			const result = await announcementModule.load({ locals });

			expect(Announcements.find).toHaveBeenCalledWith({ owner: 'org1' });
			expect(result).toEqual({
				announcements: [
					{
						id: '1',
						title: 'Announcement 1',
						description: 'Description 1',
						date: '2023-01-01T00:00:00.000Z',
						createdBy: 'user1'
					},
					{
						id: '2',
						title: 'Announcement 2',
						description: 'Description 2',
						date: '2023-01-02T00:00:00.000Z',
						createdBy: 'user2'
					}
				]
			});
		});

		it('should throw error if fetching announcements fails', async () => {
			const locals = { user: { organisation: 'org1' as unknown as ObjectId } };

			(Announcements.find as any).mockRejectedValue(new Error('Database error'));

			try {
				await announcementModule.load({ locals });
			} catch (e) {
				expect(e).toEqual(error(500, 'Error occurred while fetching announcements'));
			}
		});
	});

	describe('actions.post', () => {
		it('should create a new announcement successfully', async () => {
			const mockRequest = {
				formData: vi.fn().mockResolvedValue(new FormData())
			};

			const locals = { user: { role: 'admin', id: 'user1', organisation: 'org1' } };

			(Announcements as any).mockImplementation(() => ({ save: vi.fn() }));

			const result = await announcementModule.actions.post({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(Announcements).toHaveBeenCalled();
		});

		it('should fail if user is not admin', async () => {
			const mockRequest = {
				formData: vi.fn().mockResolvedValue(new FormData())
			};

			const locals = { user: { role: 'user' } };

			try {
				await announcementModule.actions.post({ request: mockRequest, locals } as any);
			} catch (e) {
				expect(e).toEqual(error(401, 'Unauthorised'));
			}
		});
	});

	describe('actions.edit', () => {
		it('should edit an announcement successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');
			mockFormData.append('title', 'Updated Title');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };

			(Announcements.findByIdAndUpdate as any).mockResolvedValue({
				_id: '123',
				title: 'Updated Title'
			});

			const result = await announcementModule.actions.edit({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(Announcements.findByIdAndUpdate).toHaveBeenCalledWith(
				'123',
				{ title: 'Updated Title', description: null },
				{ new: true }
			);
		});

		it('should fail if announcement not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };

			(Announcements.findByIdAndUpdate as any).mockResolvedValue(null);

			await announcementModule.actions.edit({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(500, { error: 'Failed to update announcement' });
		});
	});

	describe('actions.delete', () => {
		it('should delete an announcement successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };

			(Announcements.findByIdAndDelete as any).mockResolvedValue({ _id: '123' });

			const result = await announcementModule.actions.delete({
				request: mockRequest,
				locals
			} as any);

			expect(result).toEqual({ success: true });
			expect(Announcements.findByIdAndDelete).toHaveBeenCalledWith('123');
		});

		it('should fail if announcement not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'admin' } };

			(Announcements.findByIdAndDelete as any).mockResolvedValue(null);

			await announcementModule.actions.delete({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(500, { error: 'Failed to remove announcement' });
		});
	});
});
