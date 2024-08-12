import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';

import Upcoming from '$lib/components/lessons/Upcoming.svelte';

const mockLessons = [
	{
		id: 1,
		topic: 'Math',
		description: 'Algebra basics',
		date: '2023-10-01',
		time: '10:00 AM'
	},
	{
		id: 2,
		topic: 'Science',
		description: 'Introduction to Physics',
		date: '2023-10-02',
		time: '11:00 AM'
	}
];

describe('Upcoming Component', () => {
	it('renders lessons correctly', () => {
		render(Upcoming, { lessons: mockLessons, role: 'student' });

		mockLessons.forEach((lesson) => {
			expect(screen.getByText(lesson.topic)).toBeInTheDocument();
			expect(screen.getByText(lesson.description)).toBeInTheDocument();
			expect(screen.getByText(lesson.date)).toBeInTheDocument();
			expect(screen.getByText(lesson.time)).toBeInTheDocument();
		});
	});

	it('renders lecturer buttons when role is lecturer', async () => {
		render(Upcoming, { lessons: mockLessons, role: 'lecturer' });

		const buttons = await screen.findAllByRole('button');
		expect(buttons.length / 2).toBe(mockLessons.length);
	});

	it('does not render lecturer buttons when role is student', () => {
		render(Upcoming, { lessons: mockLessons, role: 'student' });

		const buttons = screen.queryAllByRole('button');
		expect(buttons.length).toBe(0);
	});
});
