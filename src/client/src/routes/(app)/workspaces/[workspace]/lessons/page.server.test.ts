import { fail, error } from '@sveltejs/kit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Lessons from '$db/schemas/Lesson';
import * as lessonModule from './+page.server';

vi.mock('$db/schemas/Lesson', () => {
	const LessonMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	LessonMock.find = vi.fn();
	LessonMock.findById = vi.fn();
	LessonMock.findByIdAndUpdate = vi.fn();
	LessonMock.findByIdAndDelete = vi.fn();

	return { default: LessonMock };
});

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn(),
		error: vi.fn()
	};
});

describe('Lesson Management', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should return lessons and user role', async () => {
			const locals = { user: { role: 'lecturer' } };
			const params = { workspace: 'workspace1' };
			const mockLessons = [
				{ _id: '1', date: new Date(), time: '10:00', topic: 'Topic1', description: 'Desc1' },
				{ _id: '2', date: new Date(), time: '11:00', topic: 'Topic2', description: 'Desc2' }
			];

			(Lessons.find as any).mockResolvedValue(mockLessons);

			const result = await lessonModule.load({ locals, params } as any);

			expect(result).toEqual({
				role: 'lecturer',
				lessons: [
					{ id: '1', date: expect.any(Date), time: '10:00', topic: 'Topic1', description: 'Desc1' },
					{ id: '2', date: expect.any(Date), time: '11:00', topic: 'Topic2', description: 'Desc2' }
				]
			});
		});

		it('should throw error on server error', async () => {
			const locals = { user: { role: 'lecturer' } };
			const params = { workspace: 'workspace1' };

			(Lessons.find as any).mockRejectedValue(new Error('Database error'));

			await expect(lessonModule.load({ locals, params } as any)).rejects.toEqual(
				error(500, 'An unexpected error occurred while loading lessons')
			);
		});
	});

	describe('actions.schedule', () => {
		it('should schedule a new lesson successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('topic', 'New Topic');
			mockFormData.append('date', '2023-07-01');
			mockFormData.append('time', '14:00');
			mockFormData.append('description', 'New Description');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };
			const params = { workspace: 'workspace1' };

			const mockLesson = { save: vi.fn() };
			(Lessons as any).mockImplementation(() => mockLesson);

			const result = await lessonModule.actions.schedule({
				request: mockRequest,
				locals,
				params
			} as any);

			expect(result).toEqual({ success: true });
			expect(Lessons).toHaveBeenCalledWith({
				topic: 'New Topic',
				date: new Date('2023-07-01T14:00'),
				time: '14:00',
				description: 'New Description',
				workspace: 'workspace1'
			});
			expect(mockLesson.save).toHaveBeenCalled();
		});

		it('should fail if user is not a lecturer', async () => {
			const locals = { user: { role: 'student' } };

			await expect(lessonModule.actions.schedule({ locals } as any)).rejects.toEqual(
				error(401, 'Unauthorized')
			);
		});

		it('should fail if required fields are missing', async () => {
			const mockFormData = new FormData();
			mockFormData.append('topic', 'New Topic');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };
			const params = { workspace: 'workspace1' };

			const result = await lessonModule.actions.schedule({
				request: mockRequest,
				locals,
				params
			} as any);

			expect(fail).toHaveBeenCalledWith(400, { message: 'Date is required' });
		});
	});

	describe('actions.edit', () => {
		it('should edit a lesson successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');
			mockFormData.append('topic', 'Updated Topic');
			mockFormData.append('date', '2023-07-02');
			mockFormData.append('time', '15:00');
			mockFormData.append('description', 'Updated Description');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };

			const mockLesson = {
				date: new Date('2023-07-01T14:00'),
				save: vi.fn()
			};
			(Lessons.findById as any).mockResolvedValue(mockLesson);
			(Lessons.findByIdAndUpdate as any).mockResolvedValue({});

			const result = await lessonModule.actions.edit({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(Lessons.findByIdAndUpdate).toHaveBeenCalledWith(
				'123',
				{
					topic: 'Updated Topic',
					date: new Date('2023-07-02T15:00'),
					time: '15:00',
					description: 'Updated Description'
				},
				{ new: true }
			);
		});

		it('should fail if lesson not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };
			(Lessons.findByIdAndUpdate as any).mockResolvedValue(null);

			const result = await lessonModule.actions.edit({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Lesson not found' });
		});
	});

	describe('actions.delete', () => {
		it('should delete a lesson successfully', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };
			(Lessons.findByIdAndDelete as any).mockResolvedValue({});

			const result = await lessonModule.actions.delete({ request: mockRequest, locals } as any);

			expect(result).toEqual({ success: true });
			expect(Lessons.findByIdAndDelete).toHaveBeenCalledWith('123');
		});

		it('should fail if lesson not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '123');

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };
			(Lessons.findByIdAndDelete as any).mockResolvedValue(null);

			const result = await lessonModule.actions.delete({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(404, { message: 'Lesson not found' });
		});

		it('should fail if lesson ID is not provided', async () => {
			const mockFormData = new FormData();

			const mockRequest = {
				formData: vi.fn().mockResolvedValue(mockFormData)
			};

			const locals = { user: { role: 'lecturer' } };

			const result = await lessonModule.actions.delete({ request: mockRequest, locals } as any);

			expect(fail).toHaveBeenCalledWith(400, { error: 'Lesson ID is required' });
		});
	});
});
