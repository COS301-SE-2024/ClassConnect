import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Enrol from '$lib/components/modals/user/Enrol.svelte';

const workspaces = [
	{ id: '1', name: 'Workspace 1', image: '/path/to/image1.png' },
	{ id: '2', name: 'Workspace 2', image: '/path/to/image2.png' }
];

const assignedWorkspaces = ['1'];

describe('Enrol Modal', () => {
	const defaultProps = {
		id: '123',
		role: 'Student',
		open: true,
		workspaces,
		assignedWorkspaces
	};

	it('should display available workspaces for enrollment when open is true', async () => {
		const { getByText, getByLabelText } = render(Enrol, {
			props: { ...defaultProps, open: true }
		});

		expect(getByText('Enrol Student')).toBeInTheDocument();

		expect(getByText('Workspace 2')).toBeInTheDocument();

		const workspaceCheckbox = getByLabelText('Workspace 2');
		await fireEvent.click(workspaceCheckbox);
		expect(workspaceCheckbox).toBeChecked();
	});

	it('should switch to unenrollment mode when the toggle is clicked', async () => {
		const { getByText, getByLabelText } = render(Enrol, {
			props: { ...defaultProps, open: true }
		});

		const toggle = getByLabelText('Switch to Unenrol');
		await fireEvent.click(toggle);

		expect(getByText('Unenrol Student')).toBeInTheDocument();

		expect(getByText('Workspace 1')).toBeInTheDocument();
	});

	it('should submit the form with selected workspaces', async () => {
		const { getByLabelText, getByRole } = render(Enrol, {
			props: { ...defaultProps, open: true }
		});

		const workspaceCheckbox = getByLabelText('Workspace 2');
		await fireEvent.click(workspaceCheckbox);

		const submitButton = getByRole('button', { name: 'Enrol' });
		await fireEvent.click(submitButton);

		expect(workspaceCheckbox).toBeChecked();
	});
});
