import { fail, error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';

import Quizzes from '$db/schemas/Quiz';
import Activities from '$db/schemas/Activity';
import * as quizzesModule from './+page.server';

vi.mock('$db/schemas/Quiz', () => {
  const QuizzesMock: any = vi.fn().mockImplementation(() => ({
    save: vi.fn()
  }));

  QuizzesMock.find = vi.fn();
  QuizzesMock.findById = vi.fn();
  QuizzesMock.findByIdAndDelete = vi.fn();

  return { default: QuizzesMock };
});

vi.mock('$db/schemas/Activity', () => {
  const ActivitiesMock: any = vi.fn().mockImplementation(() => ({
    save: vi.fn()
  }));

  return { default: ActivitiesMock };
});

vi.mock('@sveltejs/kit', async () => {
  const actual = await vi.importActual('@sveltejs/kit');
  return {
    ...actual,
    fail: vi.fn(),
    error: vi.fn()
  };
});

describe('Quizzes Management', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('load function', () => {
    it('should return workspaceID and quizzes', async () => {
      const params = { workspace: 'workspace1' };
      const mockQuizzes = [
        { _id: '1', title: 'Quiz1', instructions: 'Inst1', graded: 'No', date: new Date(), duration: 3600000, isAvailable: true },
        { _id: '2', title: 'Quiz2', instructions: 'Inst2', graded: 'No', date: new Date(), duration: 1800000, isAvailable: false }
      ];

      (Quizzes.find as any).mockResolvedValue(mockQuizzes);

      const result = await quizzesModule.load({ params } as any);

      expect(result).toEqual({
        workspaceID: 'workspace1',
        quizzes: [
          { id: '1', title: 'Quiz1', instructions: 'Inst1', graded: 'No', date: expect.any(String), duration: 3600000, isAvailable: true },
          { id: '2', title: 'Quiz2', instructions: 'Inst2', graded: 'No', date: expect.any(String), duration: 1800000, isAvailable: false }
        ]
      });
    });

    it('should throw an error if fetching quizzes fails', async () => {
      const params = { workspace: 'workspace1' };
      (Quizzes.find as any).mockRejectedValue(new Error('Database error'));

      await expect(quizzesModule.load({ params } as any)).rejects.toThrow('Error occurred while fetching Quizzes');
    });
  });

  describe('actions.post', () => {
    it('should create a new quiz successfully', async () => {
      const mockFormData = new FormData();
      mockFormData.append('title', 'New Quiz');
      mockFormData.append('duration', '60');
      mockFormData.append('instructions', 'Quiz instructions');
  
      const mockRequest = {
        formData: vi.fn().mockResolvedValue(mockFormData)
      };
  
      const locals = { user: { role: 'lecturer' } };
      const params = { workspace: 'workspace1' };
  
      const mockQuiz = {
        save: vi.fn().mockResolvedValue(undefined)
      };
      const mockActivity = {
        save: vi.fn().mockResolvedValue(undefined)
      };
  
      (Quizzes as any).mockImplementation(() => mockQuiz);
      (Activities as any).mockImplementation(() => mockActivity);
  
      const result = await quizzesModule.actions.post({ request: mockRequest, locals, params } as any);
  
      expect(result).toEqual({ success: true });
      expect(Quizzes).toHaveBeenCalledWith({
        title: 'New Quiz',
        graded: 'No',
        instructions: 'Quiz instructions',
        owner: expect.any(mongoose.Types.ObjectId),
        duration: 3600000
      });
      expect(mockQuiz.save).toHaveBeenCalled();
      expect(Activities).toHaveBeenCalledWith({
        title: 'New Quiz: New Quiz',
        description: 'Quiz instructions',
        date: expect.any(Date),
        owner: expect.any(mongoose.Types.ObjectId),
        type: 'quiz'
      });
      expect(mockActivity.save).toHaveBeenCalled();
    });

    it('should fail if user is not a lecturer', async () => {
      const locals = { user: { role: 'student' } };

      await expect(quizzesModule.actions.post({ locals } as any)).rejects.toEqual(
        error(401, 'Unauthorised')
      );
    });
  });

  describe('actions.delete', () => {
    it('should delete a quiz successfully', async () => {
      const mockFormData = new FormData();
      mockFormData.append('id', '123');

      const mockRequest = {
        formData: vi.fn().mockResolvedValue(mockFormData)
      };

      const locals = { user: { role: 'lecturer' } };
      (Quizzes.findByIdAndDelete as any).mockResolvedValue({ _id: '123' });

      const result = await quizzesModule.actions.delete({ request: mockRequest, locals } as any);

      expect(result).toEqual({ success: true });
      expect(Quizzes.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

    it('should fail if quiz not found', async () => {
      const mockFormData = new FormData();
      mockFormData.append('id', '123');

      const mockRequest = {
        formData: vi.fn().mockResolvedValue(mockFormData)
      };

      const locals = { user: { role: 'lecturer' } };
      (Quizzes.findByIdAndDelete as any).mockResolvedValue(null);

      await expect(quizzesModule.actions.delete({ request: mockRequest, locals } as any)).rejects.toThrow('Quiz not found');
    });
  });

  describe('actions.toggleAvailability', () => {
    it('should toggle quiz availability successfully', async () => {
      const mockFormData = new FormData();
      mockFormData.append('quizId', '123');
      mockFormData.append('isAvailable', 'true');

      const mockRequest = {
        formData: vi.fn().mockResolvedValue(mockFormData)
      };

      const mockQuiz = {
        isAvailable: false,
        save: vi.fn()
      };

      (Quizzes.findById as any).mockResolvedValue(mockQuiz);

      const result = await quizzesModule.actions.toggleAvailability({ request: mockRequest } as any);

      expect(result).toEqual({ success: true });
      expect(mockQuiz.isAvailable).toBe(true);
      expect(mockQuiz.save).toHaveBeenCalled();
    });

    it('should fail if quiz not found', async () => {
      const mockFormData = new FormData();
      mockFormData.append('quizId', '123');
      mockFormData.append('isAvailable', 'true');

      const mockRequest = {
        formData: vi.fn().mockResolvedValue(mockFormData)
      };

      (Quizzes.findById as any).mockResolvedValue(null);

      await quizzesModule.actions.toggleAvailability({ request: mockRequest } as any);

      expect(fail).toHaveBeenCalledWith(404, { error: 'Quiz not found' });
    });
  });
});