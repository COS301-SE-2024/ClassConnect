import { fail, error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as announcementsModule from './+page.server'; 

vi.mock('$lib/server/utils/announcements', () => ({
    validateUser: vi.fn(),
    addAnnouncement: vi.fn(),
    getAnnouncements: vi.fn(),
    editAnnouncement: vi.fn(),
    deleteAnnouncement: vi.fn()
}));

describe('Announcements Management', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe('load function', () => {
        it('should load announcements successfully', async () => {
            const mockAnnouncements = [
                { id: '1', title: 'Announcement 1' },
                { id: '2', title: 'Announcement 2' }
            ];

            (announcementsModule.getAnnouncements as any).mockResolvedValue(mockAnnouncements);

            const result = await announcementsModule.load({
                locals: { user: { id: '123', role: 'lecturer' } },
                params: { workspace: 'test' }
            } as any);

            expect(result).toEqual({
                announcements: mockAnnouncements,
                id: '123',
                role: 'lecturer'
            });
        });

        it('should handle errors during load', async () => {
            (announcementsModule.getAnnouncements as any).mockRejectedValue(new Error('Test error'));

            await expect(announcementsModule.load({
                locals: { user: { id: '123', role: 'lecturer' } },
                params: { workspace: 'test' }
            } as any)).rejects.toEqual(error(500, 'Error occurred while fetching announcements'));
        });
    });

    describe('actions.post', () => {
        it('should add an announcement successfully', async () => {
            const mockFormData = new FormData();
            mockFormData.append('title', 'New Announcement');

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(mockFormData)
            };

            (announcementsModule.validateUser as any).mockImplementation(() => {});
            (announcementsModule.addAnnouncement as any).mockResolvedValue({ success: true });

            const result = await announcementsModule.actions.post({
                request: mockRequest,
                locals: { user: { role: 'lecturer' } },
                params: { workspace: 'test' }
            } as any);

            expect(result).toEqual({ success: true });
            expect(announcementsModule.addAnnouncement).toHaveBeenCalledWith(mockFormData, 'test');
        });

        it('should handle errors during add announcement', async () => {
            const mockFormData = new FormData();
            mockFormData.append('title', 'New Announcement');

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(mockFormData)
            };

            (announcementsModule.validateUser as any).mockImplementation(() => {});
            (announcementsModule.addAnnouncement as any).mockRejectedValue(new Error('Test error'));

            const result = await announcementsModule.actions.post({
                request: mockRequest,
                locals: { user: { role: 'lecturer' } },
                params: { workspace: 'test' }
            } as any);

            expect(result).toEqual(fail(500, { error: 'Failed to add announcement' }));
        });

        it('should fail if user is not authenticated as lecturer', async () => {
            const mockRequest = {
                formData: vi.fn().mockResolvedValue(new FormData())
            };

            await expect(announcementsModule.actions.post({
                request: mockRequest,
                locals: { user: { role: 'student' } },
                params: { workspace: 'test' }
            } as any)).rejects.toEqual(error(401, 'Unauthorized'));
        });
    });

    describe('actions.edit', () => {
        it('should edit an announcement successfully', async () => {
            const mockFormData = new FormData();
            mockFormData.append('id', '1');
            mockFormData.append('title', 'Updated Announcement');

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(mockFormData)
            };

            (announcementsModule.validateUser as any).mockImplementation(() => {});
            (announcementsModule.editAnnouncement as any).mockResolvedValue({ success: true });

            const result = await announcementsModule.actions.edit({
                request: mockRequest,
                locals: { user: { role: 'lecturer' } }
            } as any);

            expect(result).toEqual({ success: true });
            expect(announcementsModule.editAnnouncement).toHaveBeenCalledWith(mockFormData);
        });

        it('should handle errors during edit announcement', async () => {
            const mockFormData = new FormData();
            mockFormData.append('id', '1');
            mockFormData.append('title', 'Updated Announcement');

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(mockFormData)
            };

            (announcementsModule.validateUser as any).mockImplementation(() => {});
            (announcementsModule.editAnnouncement as any).mockRejectedValue(new Error('Test error'));

            const result = await announcementsModule.actions.edit({
                request: mockRequest,
                locals: { user: { role: 'lecturer' } }
            } as any);

            expect(result).toEqual(fail(500, { error: 'Failed to update announcement' }));
        });

        it('should fail if user is not authenticated as lecturer', async () => {
            const mockRequest = {
                formData: vi.fn().mockResolvedValue(new FormData())
            };

            await expect(announcementsModule.actions.edit({
                request: mockRequest,
                locals: { user: { role: 'student' } }
            } as any)).rejects.toEqual(error(401, 'Unauthorized'));
        });
    });

    describe('actions.delete', () => {
        it('should delete an announcement successfully', async () => {
            const mockFormData = new FormData();
            mockFormData.append('id', '1');

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(mockFormData)
            };

            (announcementsModule.validateUser as any).mockImplementation(() => {});
            (announcementsModule.deleteAnnouncement as any).mockResolvedValue({ success: true });

            const result = await announcementsModule.actions.delete({
                request: mockRequest,
                locals: { user: { role: 'lecturer' } }
            } as any);

            expect(result).toEqual({ success: true });
            expect(announcementsModule.deleteAnnouncement).toHaveBeenCalledWith('1');
        });

        it('should handle errors during delete announcement', async () => {
            const mockFormData = new FormData();
            mockFormData.append('id', '1');

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(mockFormData)
            };

            (announcementsModule.validateUser as any).mockImplementation(() => {});
            (announcementsModule.deleteAnnouncement as any).mockRejectedValue(new Error('Test error'));

            const result = await announcementsModule.actions.delete({
                request: mockRequest,
                locals: { user: { role: 'lecturer' } }
            } as any);

            expect(result).toEqual(fail(500, { error: 'Failed to remove announcement' }));
        });

        it('should fail if user is not authenticated as lecturer', async () => {
            const mockRequest = {
                formData: vi.fn().mockResolvedValue(new FormData())
            };

            await expect(announcementsModule.actions.delete({
                request: mockRequest,
                locals: { user: { role: 'student' } }
            } as any)).rejects.toEqual(error(401, 'Unauthorized'));
        });
    });
});
