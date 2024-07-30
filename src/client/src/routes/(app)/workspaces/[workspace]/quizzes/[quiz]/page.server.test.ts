import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { load as loadQuiz, actions as quizActions } from './';
import { load as loadQuestion, actions as questionActions } from './+page.server';
import Quizzes from '$db/schemas/Quiz';
import Questions from '$db/schemas/Question';
import { fail, error, redirect } from '@sveltejs/kit';

vi.mock('$db/schemas/Quiz', () => {
    const QuizMock: any = vi.fn().mockImplementation(() => ({
        save: vi.fn()
    }));

    QuizMock.find = vi.fn();

    return { default: QuizMock };
});

vi.mock('$db/schemas/Question', () => {
    const QuestionMock: any = vi.fn().mockImplementation(() => ({
        save: vi.fn()
    }));

    QuestionMock.find = vi.fn();

    return { default: QuestionMock };
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
                status: 500,
                error: 'Failed to post quiz'
            });
        });
    });
});

describe('Question Management', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe('load function', () => {
        it('should return questions for a given quiz', async () => {
            const mockQuestion = {
                _id: new mongoose.Types.ObjectId(),
                questionNumber: 1,
                questionContent: 'Sample Question Content',
                questionType: 'multiple-choice',
                options: [
                    { content: 'Option 1', points: 10 },
                    { content: 'Option 2', points: 5 },
                    { content: 'Option 3', points: 0 }
                ],
                quiz: 'quiz_id'
            };

            Questions.find.mockResolvedValue([mockQuestion]);

            const params = { quiz: 'quiz_id' };
            const locals = { user: { role: 'lecturer' } };
            const result = await loadQuestion({ params, locals });

            expect(result).toEqual({
                questions: [{
                    questionNumber: 1,
                    questionContent: 'Sample Question Content',
                    questionType: 'multiple-choice',
                    options: [
                        { content: 'Option 1', points: 10 },
                        { content: 'Option 2', points: 5 },
                        { content: 'Option 3', points: 0 }
                    ]
                }],
                role: 'lecturer'
            });

            expect(Questions.find).toHaveBeenCalledWith({ quiz: 'quiz_id' });
        });

        it('should throw an error if fetching questions fails', async () => {
            Questions.find.mockRejectedValue(new Error('Failed to fetch questions'));

            const params = { quiz: 'quiz_id' };
            const locals = { user: { role: 'lecturer' } };

            await expect(loadQuestion({ params, locals })).rejects.toThrow('Error occurred while fetching Questions');
        });
    });

    describe('actions.post', () => {
        it('should create a new question', async () => {
            const mockFormData = new FormData();
            mockFormData.append('questionNumber', '1');
            mockFormData.append('questionContent', 'New Question Content');
            mockFormData.append('options[0].content', 'Option 1');
            mockFormData.append('options[0].points', '10');
            mockFormData.append('options[1].content', 'Option 2');
            mockFormData.append('options[1].points', '5');
            mockFormData.append('options[2].content', 'Option 3');
            mockFormData.append('options[2].points', '0');

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(mockFormData)
            };

            const locals = { user: { role: 'lecturer' } };
            const params = { quiz: 'quiz_id' };

            const result = await questionActions.post({
                request: mockRequest,
                locals,
                params
            });

            expect(result).toEqual({ success: true });
            expect(Questions.prototype.save).toHaveBeenCalled();
        });

        it('should fail if user is not a lecturer', async () => {
            const mockFormData = new FormData();
            mockFormData.append('questionNumber', '1');
            mockFormData.append('questionContent', 'New Question Content');
            mockFormData.append('options[0].content', 'Option 1');
            mockFormData.append('options[0].points', '10');
            mockFormData.append('options[1].content', 'Option 2');
            mockFormData.append('options[1].points', '5');
            mockFormData.append('options[2].content', 'Option 3');
            mockFormData.append('options[2].points', '0');

            const mockRequest = {
                formData: vi.fn().mockResolvedValue(mockFormData)
            };

            const locals = { user: { role: 'student' } };
            const params = { quiz: 'quiz_id' };

            await expect(questionActions.post({
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
            const params = { quiz: 'quiz_id' };

            const result = await questionActions.post({
                request: mockRequest,
                locals,
                params
            });

            expect(result).toEqual({
                status: 500,
                error: 'Failed to create question'
            });
        });
    });
});
