import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ModalComponent from '$lib/components/modals/quizzes/Add.svelte'; 

describe('ModalComponent - Add Quiz Modal', () => {
	const defaultProps = {
		open: true
	};

	it('should open modal when open is true', () => {
		const { getByText } = render(ModalComponent, {
			props: { ...defaultProps, open: true }
		});

		expect(getByText('Add Quiz')).toBeInTheDocument();
	});

	it('should hide modal when open is false', () => {
		const { queryByText } = render(ModalComponent, {
			props: { ...defaultProps, open: false }
		});

		expect(queryByText('Add Quiz')).not.toBeInTheDocument();
	});

	

	it('should submit form with valid inputs', async () => {
		const { getByLabelText, getByRole, getByText } = render(ModalComponent, {
			props: { ...defaultProps }
		});

		const titleInput = getByLabelText('Title') as HTMLInputElement;
		const durationInput = getByLabelText('Duration (in minutes)') as HTMLInputElement;
		const instructionsTextarea = getByLabelText('Add Instructions') as HTMLTextAreaElement;
		const submitButton = getByRole('button', { name: 'Create Quiz' });

		
		await fireEvent.input(titleInput, { target: { value: 'New Quiz' } });
		await fireEvent.input(durationInput, { target: { value: '45' } });
		await fireEvent.input(instructionsTextarea, { target: { value: 'These are instructions.' } });

		// Simulate form submission
		await fireEvent.click(submitButton);

		expect(titleInput.value).toBe('New Quiz');
		expect(durationInput.value).toBe('45');
		expect(instructionsTextarea.value).toBe('These are instructions.');
	});

	it('should display toolbar buttons correctly', () => {
		const { getByRole } = render(ModalComponent, {
			props: { ...defaultProps, open: true }
		});

		expect(getByRole('button', { name: 'Attach file' })).toBeInTheDocument();
		expect(getByRole('button', { name: 'Embed map' })).toBeInTheDocument();
		expect(getByRole('button', { name: 'Upload image' })).toBeInTheDocument();
		expect(getByRole('button', { name: 'Format code' })).toBeInTheDocument();
		expect(getByRole('button', { name: 'Add emoji' })).toBeInTheDocument();
	});
});
