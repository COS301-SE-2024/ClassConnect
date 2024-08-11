import { describe, it, expect, vi } from 'vitest';
import * as pageServer from './+page.server';
import mongoose from 'mongoose';
import Questions from '$db/schemas/Question';

vi.mock('$db/schemas/Question', () => ({
    default: {
        save: vi.fn(),
    },
}));

describe('pageServer.actions.post', () => {
    it('should successfully create a question', async () => {
        const mockRequest = {
            formData: vi.fn().mockResolvedValue(new FormData([
                ['questionNumber', '1'],
                ['questionContent', 'Sample question content'],
                ['options[0].content', 'Option 1'],
                ['options[0].points', '10'],
                ['options[1].content', 'Option 2'],
                ['options[1].points', '20'],
            ])),
        };

        const mockLocals = { user: { role: 'lecturer' } };
        const mockParams = { quiz: new mongoose.Types.ObjectId().toString() };

        const result = await pageServer.actions.post({
            request: mockRequest as any,
            locals: mockLocals,
            params: mockParams,
        });

        expect(result).toEqual({ success: true });
        expect(Questions.prototype.save).toHaveBeenCalled();
    });

    it('should fail when lecturer is unauthorized', async () => {
        const mockLocals = { user: { role: 'student' } };
        const mockParams = { quiz: new mongoose.Types.ObjectId().toString() };

        await expect(pageServer.actions.post({
            request: {} as any,
            locals: mockLocals,
            params: mockParams,
        })).rejects.toThrow('Unauthorised');
    });

    it('should fail when an error occurs during creation', async () => {
        vi.spyOn(Questions.prototype, 'save').mockRejectedValue(new Error('Database error'));

        const mockRequest = {
            formData: vi.fn().mockResolvedValue(new FormData([
                ['questionNumber', '1'],
                ['questionContent', 'Sample question content'],
                ['options[0].content', 'Option 1'],
                ['options[0].points', '10'],
                ['options[1].content', 'Option 2'],
                ['options[1].points', '20'],
            ])),
        };

        const mockLocals = { user: { role: 'lecturer' } };
        const mockParams = { quiz: new mongoose.Types.ObjectId().toString() };

        const result = await pageServer.actions.post({
            request: mockRequest as any,
            locals: mockLocals,
            params: mockParams,
        });

        expect(result).toEqual({ error: 'Failed to create question' });
        expect(Questions.prototype.save).toHaveBeenCalled();
    });
});
