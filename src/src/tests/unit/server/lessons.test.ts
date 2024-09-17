import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	getLessons,
	getRecordings,
	scheduleLesson,
	editLesson,
	deleteLesson,
	deleteRecording
} from '$lib/server/utils/lessons';
import { fail } from '@sveltejs/kit';
import Lessons from '$db/schemas/Lesson';
import Recordings from '$db/schemas/Recording';
import { deleteFile } from '$lib/server/storage';

vi.mock('$db/schemas/Activity', () => ({
	default: vi.fn()
}));

vi.mock('$db/schemas/Lesson', () => ({
	default: {
		find: vi.fn(),
		findById: vi.fn(),
		findByIdAndUpdate: vi.fn(),
		findByIdAndDelete: vi.fn(),
		save: vi.fn()
	}
}));

vi.mock('$db/schemas/Recording', () => ({
	default: {
		find: vi.fn(),
		findById: vi.fn(),
		findByIdAndDelete: vi.fn(),
		save: vi.fn()
	}
}));

vi.mock('$lib/server/storage', () => ({
	deleteFile: vi.fn()
}));

vi.mock('@sveltejs/kit', () => ({
	fail: vi.fn()
}));

describe('lessons functions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getLessons', () => {
		it('should return formatted lessons', async () => {
			const lessons = [
				{
					_id: '1',
					date: '2023-01-01',
					time: '10:00',
					topic: 'Topic 1',
					description: 'Description 1'
				},
				{
					_id: '2',
					date: '2023-01-02',
					time: '11:00',
					topic: 'Topic 2',
					description: 'Description 2'
				}
			];
			Lessons.find.mockResolvedValue(lessons);

			const result = await getLessons('workspace-id');

			expect(Lessons.find).toHaveBeenCalledWith({ workspace: 'workspace-id' });
			expect(result).toEqual([
				{
					id: '1',
					date: '2023-01-01',
					time: '10:00',
					topic: 'Topic 1',
					description: 'Description 1'
				},
				{
					id: '2',
					date: '2023-01-02',
					time: '11:00',
					topic: 'Topic 2',
					description: 'Description 2'
				}
			]);
		});
	});

	describe('getRecordings', () => {
		it('should return formatted recordings', async () => {
			const recordings = [
				{
					_id: '1',
					date: '2023-01-01',
					time: '10:00',
					topic: 'Topic 1',
					description: 'Description 1',
					url: 'url1'
				},
				{
					_id: '2',
					date: '2023-01-02',
					time: '11:00',
					topic: 'Topic 2',
					description: 'Description 2',
					url: 'url2'
				}
			];
			Recordings.find.mockResolvedValue(recordings);

			const result = await getRecordings('workspace-id');

			expect(Recordings.find).toHaveBeenCalledWith({ workspace: 'workspace-id' });
			expect(result).toEqual([
				{
					id: '1',
					date: '2023-01-01',
					time: '10:00',
					topic: 'Topic 1',
					description: 'Description 1',
					url: 'url1'
				},
				{
					id: '2',
					date: '2023-01-02',
					time: '11:00',
					topic: 'Topic 2',
					description: 'Description 2',
					url: 'url2'
				}
			]);
		});
	});

	describe('scheduleLesson', () => {
		it('should return 400 if topic is missing', async () => {
			const data = new FormData();
			data.append('date', '2023-01-01');
			data.append('time', '10:00');
			data.append('description', 'Test Description');

			const result = await scheduleLesson(data, 'workspace-id');

			expect(fail).toHaveBeenCalledWith(400, { message: 'Topic is required' });
			expect(result).toBeUndefined();
		});

		it('should return 400 if date is missing', async () => {
			const data = new FormData();
			data.append('topic', 'Test Topic');
			data.append('time', '10:00');
			data.append('description', 'Test Description');

			const result = await scheduleLesson(data, 'workspace-id');

			expect(fail).toHaveBeenCalledWith(400, { message: 'Date is required' });
			expect(result).toBeUndefined();
		});

		it('should return 400 if time is missing', async () => {
			const data = new FormData();
			data.append('topic', 'Test Topic');
			data.append('date', '2023-01-01');
			data.append('description', 'Test Description');

			const result = await scheduleLesson(data, 'workspace-id');

			expect(fail).toHaveBeenCalledWith(400, { message: 'Time is required' });
			expect(result).toBeUndefined();
		});
	});

	describe('editLesson', () => {
		it('should edit a lesson successfully', async () => {
			const lesson = { date: new Date('2023-01-01T10:00') };
			Lessons.findById.mockResolvedValue(lesson);

			const data = new FormData();
			data.append('id', 'lesson-id');
			data.append('date', '2023-01-02');
			data.append('time', '11:00');
			data.append('topic', 'Updated Topic');
			data.append('description', 'Updated Description');

			await editLesson(data);
		});

		it('should return 404 if lesson is not found', async () => {
			Lessons.findById.mockResolvedValue(null);

			const data = new FormData();
			data.append('id', 'lesson-id');
			data.append('date', '2023-01-02');
			data.append('time', '11:00');
			data.append('topic', 'Updated Topic');
			data.append('description', 'Updated Description');

			const result = await editLesson(data);

			expect(fail).toHaveBeenCalledWith(404, { error: 'Lesson not found' });
			expect(result).toBeUndefined();
		});
	});

	describe('deleteLesson', () => {
		it('should delete a lesson successfully', async () => {
			Lessons.findByIdAndDelete.mockResolvedValue(true);

			const result = await deleteLesson('lesson-id');

			expect(Lessons.findByIdAndDelete).toHaveBeenCalledWith('lesson-id');
			expect(result).toEqual({ success: true });
		});

		it('should return 400 if lesson ID is missing', async () => {
			const result = await deleteLesson('');

			expect(fail).toHaveBeenCalledWith(400, { error: 'Lesson ID is required' });
			expect(result).toBeUndefined();
		});

		it('should return 404 if lesson is not found', async () => {
			Lessons.findByIdAndDelete.mockResolvedValue(null);

			const result = await deleteLesson('lesson-id');

			expect(Lessons.findByIdAndDelete).toHaveBeenCalledWith('lesson-id');
			expect(fail).toHaveBeenCalledWith(404, { message: 'Lesson not found' });
			expect(result).toBeUndefined();
		});
	});

	describe('deleteRecording', () => {
		it('should delete a recording successfully', async () => {
			const recording = { url: 'http://example.com/video.mp4' };
			Recordings.findById.mockResolvedValue(recording);

			const result = await deleteRecording('recording-id');

			expect(Recordings.findById).toHaveBeenCalledWith('recording-id');
			expect(deleteFile).toHaveBeenCalledWith('http://example.com/video.mp4');
			expect(Recordings.findByIdAndDelete).toHaveBeenCalledWith('recording-id');
			expect(result).toEqual({ success: true });
		});

		it('should return 400 if recording ID is missing', async () => {
			const result = await deleteRecording('');

			expect(fail).toHaveBeenCalledWith(400, { error: 'Lesson ID is required' });
			expect(result).toBeUndefined();
		});

		it('should return 404 if recording is not found', async () => {
			Recordings.findById.mockResolvedValue(null);

			const result = await deleteRecording('recording-id');

			expect(Recordings.findById).toHaveBeenCalledWith('recording-id');
			expect(fail).toHaveBeenCalledWith(404, { message: 'Recording not found' });
			expect(result).toBeUndefined();
		});

		it('should handle errors during file deletion', async () => {
			const recording = { url: 'http://example.com/video.mp4' };
			Recordings.findById.mockResolvedValue(recording);
			deleteFile.mockRejectedValue(new Error('Deletion error'));

			const result = await deleteRecording('recording-id');

			expect(Recordings.findById).toHaveBeenCalledWith('recording-id');
			expect(deleteFile).toHaveBeenCalledWith('http://example.com/video.mp4');
			expect(Recordings.findByIdAndDelete).toHaveBeenCalledWith('recording-id');
			expect(result).toEqual({ success: true });
		});
	});
});
