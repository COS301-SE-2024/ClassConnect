import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StudentDashboard from './StudentDashboard.svelte';
//NEED TO ADD IMPORT FOR STUDENT DASHBOARD

describe('StudentDashboard', () => {
	it('renders correctly and displays student information', async () => {
		const mockStore = {
			courses: [
				{ id: 1, name: 'Math 101' },
				{ id: 2, name: 'Physics 201' }
			],
			upcomingLessons: [{ id: 1, name: 'Introduction to Algebra', date: '2024-08-10T10:00:00Z' }],
			assessments: [{ id: 1, name: 'Midterm Exam', dueDate: '2024-08-15T23:59:59Z' }]
		};

		render(StudentDashboard, { props: { store: mockStore } });

		// Check if the sidebar is rendered
		expect(screen.getByTestId('sidebar')).toBeTruthy();

		// Check if the correct number of courses are displayed
		const courseCards = screen.getAllByTestId('course-card');
		expect(courseCards.length).toBe(mockStore.courses.length);

		// Check if the first course name is correctly displayed
		expect(courseCards[0].textContent).toContain('Math 101');

		// Check if upcoming lessons are displayed
		const upcomingLessonsTable = screen.getByTestId('upcoming-lessons');
		expect(upcomingLessonsTable).toBeTruthy();
		expect(upcomingLessonsTable.textContent).toContain('Introduction to Algebra');

		// Check if assessments are displayed
		const assessmentsTable = screen.getByTestId('assessments');
		expect(assessmentsTable).toBeTruthy();
		expect(assessmentsTable.textContent).toContain('Midterm Exam');

		// Check if the 3D viewer component is present
		expect(screen.getByTestId('threejs-viewer')).toBeTruthy();

		// Check if the chat component is present
		expect(screen.getByTestId('course-chat')).toBeTruthy();
	});
});
