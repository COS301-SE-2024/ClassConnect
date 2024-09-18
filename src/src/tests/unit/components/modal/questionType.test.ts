import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ModalComponent from '$lib/components/modals/quizzes/Edit.svelte';

describe('ModalComponent - Question Type Modal', () => {
	const defaultProps = {
		open: true
	};

	it('should open modal when open is true', () => {
		const { getByText } = render(ModalComponent, {
			props: { ...defaultProps, open: true }
		});

		expect(getByText('Choose Question Type')).toBeInTheDocument();
	});

	it('should display "Add" button and disable it when no option is selected', () => {
		const { getByText } = render(ModalComponent, {
			props: { ...defaultProps, open: true }
		});

		const addButton = getByText('Add');
		expect(addButton).toBeInTheDocument();
		expect(addButton).toBeDisabled();
	});

	it('should enable "Add" button when a question type is selected', async () => {
		const { getByText, getByLabelText } = render(ModalComponent, {
			props: { ...defaultProps, open: true }
		});

		const selectInput = getByLabelText('Select Question Type');
		const addButton = getByText('Add');

		// Initially disabled
		expect(addButton).toBeDisabled();

		// Simulate selecting a question type
		await fireEvent.change(selectInput, { target: { value: 'multiple-choice' } });

		// Now the button should be enabled
		expect(addButton).not.toBeDisabled();
	});

	it('should close modal when "Add" button is clicked with a valid selection', async () => {
		const { getByText, getByLabelText, component } = render(ModalComponent, {
			props: { ...defaultProps, open: true }
		});

		const selectInput = getByLabelText('Select Question Type');
		const addButton = getByText('Add');

		// Mock the dispatch event listener
		let dispatchedEvent = null;
		component.$on('select', (event) => {
			dispatchedEvent = event.detail;
		});

		// Simulate selecting a question type and clicking the "Add" button
		await fireEvent.change(selectInput, { target: { value: '3d-hotspot' } });
		await fireEvent.click(addButton);

		// Check if the event was dispatched correctly with the selected type
		expect(dispatchedEvent).toEqual({ type: '3d-hotspot' });
	});
});
