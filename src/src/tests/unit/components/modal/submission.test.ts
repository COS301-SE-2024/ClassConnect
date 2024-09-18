import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ModalComponent from '$lib/components/modals/quizzes/Submission.svelte'; // Adjust the import path as needed

// Mock the navigation function
vi.mock('$utils/navigation', () => ({
	navigateToParentRoute: vi.fn()
}));

describe('ModalComponent - Quiz Submission Modal', () => {
	const defaultProps = {
		open: true,
		submissionMessage: 'Your quiz has been submitted successfully!',
		percentageScore: 85.5
	};

	it('should open modal when open is true', () => {
		const { getByText } = render(ModalComponent, {
			props: { ...defaultProps, open: true }
		});

		expect(getByText('Quiz Submission')).toBeInTheDocument();
	});

	it('should hide modal when open is false', () => {
		const { queryByText } = render(ModalComponent, {
			props: { ...defaultProps, open: false }
		});

		expect(queryByText('Quiz Submission')).not.toBeInTheDocument();
	});

	

	it('should display submission message and percentage score correctly', () => {
		const { getByText } = render(ModalComponent, {
			props: defaultProps
		});

		expect(getByText('Your quiz has been submitted successfully!')).toBeInTheDocument();
		expect(getByText('Percentage Score: 85.50%')).toBeInTheDocument();
	});

	
});
