import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fail } from '@sveltejs/kit';
import Lessons from '$db/schemas/Lesson';
import Recordings from '$db/schemas/Recording';
import { deleteFile } from '$lib/server/storage';
import * as LessonManagement from '$src/routes/(app)/workspaces/[workspace]/lessons/+page.server';

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		error: vi.fn(),
		fail: vi.fn()
	};
});

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

vi.mock('$db/schemas/Activity', () => {
	const ActivityMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	return { default: ActivityMock };
});

vi.mock('$db/schemas/Recording', () => ({
	default: {
		find: vi.fn(),
		findById: vi.fn(),
		findByIdAndDelete: vi.fn()
	}
}));

vi.mock('$lib/server/storage', () => ({
	deleteFile: vi.fn()
}));

describe('Lesson Management', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getLessons', () => {
		it('should return formatted lessons', async () => {
			const mockLessons = [
				{
					_id: '1',
					date: new Date('2024-09-05'),
					time: '10:00',
					topic: 'Test',
					recurrence: 'daily'
				},
				{
					_id: '2',
					date: new Date('2024-09-05'),
					time: '14:00',
					topic: 'Test 2',
					recurrence: 'weekly'
				}
			];
			(Lessons.find as any).mockResolvedValue(mockLessons);

			const result = await LessonManagement.getLessons('workspace1');

			expect(result).toHaveLength(2);
			expect(result[0]).toHaveProperty('id', '1');
			expect(result[1]).toHaveProperty('id', '2');
		});
	});

	describe('getRecordings', () => {
		it('should return formatted recordings', async () => {
			const mockRecordings = [
				{ _id: '1', url: 'test.mp4', date: new Date('2024-09-05'), time: '10:00', topic: 'Test' },
				{ _id: '2', url: 'test2.mp4', date: new Date('2024-09-05'), time: '14:00', topic: 'Test 2' }
			];
			(Recordings.find as any).mockResolvedValue(mockRecordings);

			const result = await LessonManagement.getRecordings('workspace1');

			expect(result).toHaveLength(2);
			expect(result[0]).toHaveProperty('id', '1');
			expect(result[1]).toHaveProperty('id', '2');
		});
	});

	describe('scheduleLesson', () => {
		it('should create a new lesson and activity', async () => {
			const mockFormData = new FormData();
			mockFormData.append('topic', 'Test Lesson');
			mockFormData.append('date', '2024-09-05');
			mockFormData.append('time', '10:00');
			mockFormData.append('recurrence', 'daily');
			mockFormData.append('description', 'Test Description');

			const result = await LessonManagement.scheduleLesson(mockFormData, 'workspace1');

			expect(result).toEqual({ success: true });
		});

		it('should fail if required fields are missing', async () => {
			const mockFormData = new FormData();

			await LessonManagement.scheduleLesson(mockFormData, 'workspace1');

			expect(fail).toHaveBeenCalledWith(400, { message: 'Topic is required' });
		});
	});

	describe('editLesson', () => {
		it('should update an existing lesson', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '1');
			mockFormData.append('topic', 'Updated Test Lesson');
			mockFormData.append('date', '2024-09-06');
			mockFormData.append('time', '11:00');

			(Lessons.findByIdAndUpdate as any).mockResolvedValue({
				_id: '1',
				topic: 'Updated Test Lesson'
			});

			const result = await LessonManagement.editLesson(mockFormData);

			expect(Lessons.findByIdAndUpdate).toHaveBeenCalled();
			expect(result).toEqual({ success: true });
		});

		it('should fail if lesson is not found', async () => {
			const mockFormData = new FormData();
			mockFormData.append('id', '999');

			(Lessons.findByIdAndUpdate as any).mockResolvedValue(null);

			await LessonManagement.editLesson(mockFormData);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Lesson not found' });
		});
	});

	describe('deleteLesson', () => {
		it('should delete an existing lesson', async () => {
			(Lessons.findByIdAndDelete as any).mockResolvedValue({ _id: '1' });

			const result = await LessonManagement.deleteLesson('1');

			expect(Lessons.findByIdAndDelete).toHaveBeenCalledWith('1');
			expect(result).toEqual({ success: true });
		});

		it('should fail if lesson is not found', async () => {
			(Lessons.findByIdAndDelete as any).mockResolvedValue(null);

			await LessonManagement.deleteLesson('999');

			expect(fail).toHaveBeenCalledWith(404, { message: 'Lesson not found' });
		});
	});

	describe('deleteRecording', () => {
		it('should delete an existing recording and its file', async () => {
			(Recordings.findById as any).mockResolvedValue({ _id: '1', url: 'test.mp4' });

			const result = await LessonManagement.deleteRecording('1');

			expect(deleteFile).toHaveBeenCalledWith('test.mp4');
			expect(Recordings.findByIdAndDelete).toHaveBeenCalledWith('1');
			expect(result).toEqual({ success: true });
		});

		it('should fail if recording is not found', async () => {
			(Recordings.findById as any).mockResolvedValue(null);

			await LessonManagement.deleteRecording('999');

			expect(fail).toHaveBeenCalledWith(404, { message: 'Recording not found' });
		});
	});
});
