import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import LecturerDashboard from './LecturerDashboard.svelte';
//NEED TO ADD IMPORT FOR LECTURER DASHBOARD

describe('LecturerDashboard', () => {
	it('renders correctly and allows creating a new lesson', async () => {
		const mockStore = {
			courses: [
				{ id: 1, name: 'Math 101' },
				{ id: 2, name: 'Physics 201' }
			],
			upcomingLessons: [{ id: 1, name: 'Introduction to Algebra', date: '2024-08-10T10:00:00Z' }]
		};

		render(LecturerDashboard, { props: { store: mockStore } });

		// Check if the sidebar is rendered
		expect(screen.getByTestId('sidebar')).toBeTruthy();

		// Check if the "Create New Lesson" button exists
		const createLessonButton = screen.getByText('Create New Lesson');
		expect(createLessonButton).toBeTruthy();

		// Simulate clicking the "Create New Lesson" button
		await fireEvent.click(createLessonButton);

		// Check if the lesson creation modal is displayed
		const lessonCreationModal = screen.getByTestId('lesson-creation-modal');
		expect(lessonCreationModal).toBeTruthy();
		expect(lessonCreationModal).toBeVisible();

		// Check if the courses table is rendered
		const coursesTable = screen.getByTestId('courses-table');
		expect(coursesTable).toBeTruthy();

		// Check if the correct number of courses are listed in the table
		const tableRows = screen.getAllByTestId('course-row');
		expect(tableRows.length).toBe(mockStore.courses.length);

		// Check if the 3D model library component is present
		expect(screen.getByTestId('model-library')).toBeTruthy();

		// Check if the assessment creator component is present
		expect(screen.getByTestId('assessment-creator')).toBeTruthy();
	});
});
