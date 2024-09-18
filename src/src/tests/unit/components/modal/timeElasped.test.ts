import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ModalComponent from '$lib/components/modals/quizzes/TimeElapsed.svelte'; // Adjust the import path as needed

// Mock the navigation function
vi.mock('$utils/navigation', () => ({
	navigateToParentRoute: vi.fn()
}));

describe('ModalComponent - Time Elapsed Modal', () => {
	const defaultProps = {
		open: true,
		submissionMessage: 'Time is up! You have completed the quiz.',
		totalPoints: 85
	};

	it('should open modal when open is true', () => {
		const { getByText } = render(ModalComponent, {
			props: { ...defaultProps, open: true }
		});

		expect(getByText('Time Elapsed')).toBeInTheDocument();
	});

	it('should hide modal when open is false', () => {
		const { queryByText } = render(ModalComponent, {
			props: { ...defaultProps, open: false }
		});

		expect(queryByText('Time Elapsed')).not.toBeInTheDocument();
	});

	

	it('should display submission message and total points correctly', () => {
		const { getByText } = render(ModalComponent, {
			props: defaultProps
		});

		expect(getByText('Time is up! You have completed the quiz.')).toBeInTheDocument();
		expect(getByText('Total Points: 85')).toBeInTheDocument();
	});

	
});
