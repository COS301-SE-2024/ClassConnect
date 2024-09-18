import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Delete from '$lib/components/modals/Delete.svelte';

describe('Delete Modal', () => {
	const defaultProps = {
		id: '123',
		item: 'Item',
		open: true
	};

	it('should display the modal when open is true', () => {
		const { getByText } = render(Delete, {
			props: { ...defaultProps, open: true }
		});

		expect(getByText('Are you sure you want to delete this Item?')).toBeInTheDocument();
	});

	it('should hide the modal when open is false', () => {
		const { queryByText } = render(Delete, {
			props: { ...defaultProps, open: false }
		});

		expect(queryByText('Are you sure you want to delete this Item?')).not.toBeInTheDocument();
	});

	it('should close the modal when "No, cancel" button is clicked', async () => {
		const { getByRole, queryByText } = render(Delete, {
			props: { ...defaultProps }
		});

		const cancelButton = getByRole('button', { name: 'No, cancel' });

		await fireEvent.click(cancelButton);

		expect(queryByText('Are you sure you want to delete this Item?')).not.toBeInTheDocument();
	});
});
