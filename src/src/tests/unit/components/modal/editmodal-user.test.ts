import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Edit from '$lib/components/modals/user/Edit.svelte';

describe('Edit Modal Visibility', () => {
	const defaultProps = {
		id: '123',
		role: 'User',
		open: true,
		_name: 'John',
		surname: 'Doe',
		email: 'john@example.com'
	};

	it('should open modal when open is true', () => {
		const { getByRole } = render(Edit, {
			props: { ...defaultProps, open: true }
		});

		expect(getByRole('heading', { name: 'Edit User' })).toBeInTheDocument();
	});

	it('should have a submit button with "Edit User"', () => {
		const { getByRole } = render(Edit, {
			props: { ...defaultProps, open: true }
		});

		expect(getByRole('button', { name: 'Edit User' })).toBeInTheDocument();
	});

	it('should hide modal when open is false', () => {
		const { queryByRole } = render(Edit, {
			props: { ...defaultProps, open: false }
		});

		expect(queryByRole('heading', { name: 'Edit User' })).not.toBeInTheDocument();
	});
});

describe('Form Submission', () => {
	const defaultProps = {
		id: '123',
		role: 'User',
		open: true,
		_name: 'John',
		surname: 'Doe',
		email: 'john@example.com'
	};

	it('should submit form and trigger close', async () => {
		const { getByLabelText, getByRole } = render(Edit, {
			props: { ...defaultProps }
		});

		const nameInput = getByLabelText('Name') as HTMLInputElement;
		const submitButton = getByRole('button', { name: 'Edit User' });

		await fireEvent.input(nameInput, { target: { value: 'John Updated' } });

		await fireEvent.click(submitButton);

		expect(nameInput.value).toBe('John Updated');
	});
});
