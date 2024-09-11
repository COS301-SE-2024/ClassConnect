import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tokenProvider, saveRecording, saveRecordingLink } from '$lib/server/utils/lesson';
import { upload } from '$lib/server/storage';
import Lessons from '$db/schemas/Lesson';
import Recording from '$db/schemas/Recording';
import { StreamClient } from '@stream-io/node-sdk';
import { fail } from '@sveltejs/kit';

vi.mock('$lib/server/storage', () => ({
	upload: vi.fn()
}));

vi.mock('$db/schemas/Lesson', () => {
	const LessonMock = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	LessonMock.findById = vi.fn();
	return { default: LessonMock };
});

vi.mock('$db/schemas/Recording', () => {
	const save = vi.fn();
	return {
		default: vi.fn(() => ({ save }))
	};
});

vi.mock('@sveltejs/kit', () => ({
	fail: vi.fn()
}));

describe('recording functions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('tokenProvider', () => {
		it('should create a token with the correct parameters', async () => {
			const streamClient = {
				createToken: vi.fn().mockReturnValue('token')
			} as unknown as StreamClient;

			const id = 'user-id';
			const token = await tokenProvider(id, streamClient);

			expect(streamClient.createToken).toHaveBeenCalledWith(
				id,
				expect.any(Number),
				expect.any(Number)
			);
			expect(token).toBe('token');
		});
	});

	describe('saveRecording', () => {
		it('should save a new recording successfully', async () => {
			const lesson = {
				topic: 'Test Topic',
				description: 'Test Description',
				time: '10:00 AM',
				date: new Date(),
				workspace: 'Test Workspace'
			};
			Lessons.findById.mockResolvedValue(lesson);
			upload.mockResolvedValue('http://example.com/video.mp4');

			const data = new FormData();
			data.append('LessonID', 'lesson-id');
			data.append('video', new File(['video content'], 'video.mp4'));

			const result = await saveRecording(data);

			expect(Lessons.findById).toHaveBeenCalledWith('lesson-id');
			expect(upload).toHaveBeenCalledWith(expect.any(File));
			expect(Recording).toHaveBeenCalledWith({
				topic: lesson.topic,
				description: lesson.description,
				time: lesson.time,
				date: lesson.date,
				workspace: lesson.workspace,
				url: 'http://example.com/video.mp4'
			});
			expect(Recording().save).toHaveBeenCalled();
			expect(result).toEqual({ success: true });
		});

		it('should return 404 if lesson is not found', async () => {
			Lessons.findById.mockResolvedValue(null);

			const data = new FormData();
			data.append('LessonID', 'lesson-id');
			data.append('video', new File(['video content'], 'video.mp4'));

			const result = await saveRecording(data);

			expect(Lessons.findById).toHaveBeenCalledWith('lesson-id');
			expect(fail).toHaveBeenCalledWith(404, { message: 'Lesson not found' });
			expect(result).toBeUndefined();
		});
	});

	describe('saveRecordingLink', () => {
		it('should save a new recording link successfully', async () => {
			const lesson = {
				topic: 'Test Topic',
				description: 'Test Description',
				time: '10:00 AM',
				date: new Date(),
				workspace: 'Test Workspace'
			};
			Lessons.findById.mockResolvedValue(lesson);

			const data = new FormData();
			data.append('LessonID', 'lesson-id');
			data.append('videolink', 'http://example.com/video.mp4');

			const result = await saveRecordingLink(data);

			expect(Lessons.findById).toHaveBeenCalledWith('lesson-id');
			expect(Recording).toHaveBeenCalledWith({
				topic: lesson.topic,
				description: lesson.description,
				time: lesson.time,
				date: lesson.date,
				workspace: lesson.workspace,
				url: 'http://example.com/video.mp4'
			});
			expect(Recording().save).toHaveBeenCalled();
			expect(result).toEqual({ success: true });
		});

		it('should return 404 if lesson is not found', async () => {
			Lessons.findById.mockResolvedValue(null);

			const data = new FormData();
			data.append('LessonID', 'lesson-id');
			data.append('videolink', 'http://example.com/video.mp4');

			const result = await saveRecordingLink(data);

			expect(Lessons.findById).toHaveBeenCalledWith('lesson-id');
			expect(fail).toHaveBeenCalledWith(404, { message: 'Lesson not found' });
			expect(result).toBeUndefined();
		});

		it('should return 400 if no video link is provided', async () => {
			const lesson = {
				topic: 'Test Topic',
				description: 'Test Description',
				time: '10:00 AM',
				date: new Date(),
				workspace: 'Test Workspace'
			};
			Lessons.findById.mockResolvedValue(lesson);

			const data = new FormData();
			data.append('LessonID', 'lesson-id');

			const result = await saveRecordingLink(data);

			expect(Lessons.findById).toHaveBeenCalledWith('lesson-id');
			expect(fail).toHaveBeenCalledWith(400, { message: 'No video link provided}' });
			expect(result).toBeUndefined();
		});
	});
});
