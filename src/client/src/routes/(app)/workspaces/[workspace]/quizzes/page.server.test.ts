import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { load as loadQuiz, actions as quizActions } from './+page.server';
import Quizzes from '$db/schemas/Quiz';
import { fail, error, redirect } from '@sveltejs/kit';

vi.mock('$db/schemas/Quiz', () => {
    const QuizMock: any = vi.fn().mockImplementation(() => ({
        save: vi.fn()
    }));

    QuizMock.find = vi.fn();

    return { default: QuizMock };
});

vi.mock('@sveltejs/kit', async () => {
    const actual = await vi.importActual('@sveltejs/kit');
    return {
        ...actual,
        fail: vi.fn(),
        error: vi.fn(),
        redirect: vi.fn()
    };
});

describe('Quiz Management', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe('load function', () => {
        it('should return quizzes for a given workspace', async () => {
            const mockQuiz = {
                _id: new mongoose.Types.ObjectId(),
                title: 'Sample Quiz',
                instructions: 'Sample Instructions',
                graded: 'No',
                date: new Date(),
                owner: 'workspace_id'
            };

            Quizzes.find.mockResolvedValue([mockQuiz]);

            const params = { workspace: 'workspace_id' };
            const result = await loadQuiz({ params });

            expect(result).toEqual({
                workspaceID: 'workspace_id',
                quizzes: [{
                    title: 'Sample Quiz',
                    instructions: 'Sample Instructions',
                    id: mockQuiz._id.toString(),
                    graded: 'No',
                    date: mockQuiz.date.toISOString()
                }]
            });

            expect(Quizzes.find).toHaveBeenCalledWith({ owner: 'workspace_id' });
        });

        it('should throw an error if fetching quizzes fails', async () => {
            Quizzes.find.mockRejectedValue(new Error('Failed to fetch quizzes'));

            const params = { workspace: 'workspace_id' };

            await expect(loadQuiz({ params })).rejects.toThrow('Error occurred while fetching Quizzes');
        });
    });

    describe('actions.post', () => {
        it('should create a new quiz', async () => {
            const mockFormData = new FormData();
            mockFormData.append('title', 'New Quiz');
            mockFormData.append('instructions', 'New Instructions');

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(mockFormData)
            };

            const locals = { user: { role: 'lecturer' } };
            const params = { workspace: 'workspace_id' };

            const result = await quizActions.post({
                request: mockRequest,
                locals,
                params
            });

            expect(result).toEqual({ success: true });
            expect(Quizzes.prototype.save).toHaveBeenCalled();
        });

        it('should fail if user is not a lecturer', async () => {
            const mockFormData = new FormData();
            mockFormData.append('title', 'New Quiz');
            mockFormData.append('instructions', 'New Instructions');

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(mockFormData)
            };

            const locals = { user: { role: 'student' } };
            const params = { workspace: 'workspace_id' };

            await expect(quizActions.post({
                request: mockRequest,
                locals,
                params
            })).rejects.toThrow('Unauthorised');
        });

        it('should fail if request data is invalid', async () => {
            const invalidData = new FormData();

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(invalidData)
            };

            const locals = { user: { role: 'lecturer' } };
            const params = { workspace: 'workspace_id' };

            const result = await quizActions.post({
                request: mockRequest,
                locals,
                params
            });

            expect(result).toEqual({
                error: 'Failed to post quiz',
                status: 500
            });
        });
    });
});
