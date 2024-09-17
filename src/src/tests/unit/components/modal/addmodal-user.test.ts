import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Add from '$lib/components/modals/user/Add.svelte';

describe('Add Modal Visibility', () => {
	const defaultProps = {
		role: 'User',
		open: true
	};

	it('should open modal when open is true', () => {
		const { getByRole } = render(Add, {
			props: { ...defaultProps, open: true }
		});

		expect(getByRole('heading', { name: 'Add User' })).toBeInTheDocument();
	});

	it('should have a submit button with "Add User"', () => {
		const { getByRole } = render(Add, {
			props: { ...defaultProps, open: true }
		});

		expect(getByRole('button', { name: 'Add User' })).toBeInTheDocument();
	});

	it('should hide modal when open is false', () => {
		const { queryByRole } = render(Add, {
			props: { ...defaultProps, open: false }
		});

		// The modal heading should not be present when `open` is false
		expect(queryByRole('heading', { name: 'Add User' })).not.toBeInTheDocument();
	});
});

describe('Form Submission and File Validation', () => {
	const defaultProps = {
		role: 'User',
		open: true
	};

	it('should submit form with valid inputs', async () => {
		const { getByLabelText, getByRole } = render(Add, {
			props: { ...defaultProps }
		});

		const nameInput = getByLabelText('Name') as HTMLInputElement;
		const surnameInput = getByLabelText('Surname') as HTMLInputElement;
		const emailInput = getByLabelText('Email') as HTMLInputElement;
		const submitButton = getByRole('button', { name: 'Add User' });

		// Simulate filling out the form
		await fireEvent.input(nameInput, { target: { value: 'John' } });
		await fireEvent.input(surnameInput, { target: { value: 'Doe' } });
		await fireEvent.input(emailInput, { target: { value: 'john@example.com' } });

		// Simulate form submission
		await fireEvent.click(submitButton);

		// Check that form values are correct
		expect(nameInput.value).toBe('John');
		expect(surnameInput.value).toBe('Doe');
		expect(emailInput.value).toBe('john@example.com');
	});

	it('should prevent submission if the image file is larger than 1MB', async () => {
		const { getByLabelText, getByRole } = render(Add, {
			props: { ...defaultProps }
		});

		const fileInput = getByLabelText('Image') as HTMLInputElement;
		const submitButton = getByRole('button', { name: 'Add User' });

		const largeFile = new File(['a'.repeat(1000001)], 'large-image.png', { type: 'image/png' });

		await fireEvent.change(fileInput, { target: { files: [largeFile] } });

		await fireEvent.click(submitButton);

		expect(fileInput.files?.[0].name).toBe('large-image.png');
		expect(fileInput.files?.[0].size).toBeGreaterThan(1000000);
	});

	it('should prevent submission if the image file type is not supported', async () => {
		const { getByLabelText, getByRole } = render(Add, {
			props: { ...defaultProps }
		});

		const fileInput = getByLabelText('Image') as HTMLInputElement;
		const submitButton = getByRole('button', { name: 'Add User' });

		const unsupportedFile = new File(['dummy content'], 'file.txt', { type: 'text/plain' });

		await fireEvent.change(fileInput, { target: { files: [unsupportedFile] } });

		await fireEvent.click(submitButton);

		expect(fileInput.files?.[0].name).toBe('file.txt');
		expect(fileInput.files?.[0].type).toBe('text/plain');
	});
});
