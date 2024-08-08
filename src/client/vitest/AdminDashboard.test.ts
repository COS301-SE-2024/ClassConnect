import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import AdminDashboard from './AdminDashboard.svelte';
//NEED TO ADD IMPORT FOR ADMIN DASHBOARD

describe('AdminDashboard', () => {
	it('renders correctly and allows managing users and workspaces', async () => {
		const mockStore = {
			users: [
				{ id: 1, name: 'John Doe', role: 'student' },
				{ id: 2, name: 'Jane Smith', role: 'lecturer' }
			],
			workspaces: [{ id: 1, name: 'Computer Science Department' }]
		};

		render(AdminDashboard, { props: { store: mockStore } });

		// Check if the sidebar is rendered
		expect(screen.getByTestId('sidebar')).toBeTruthy();

		// Check if the "Add New User" button exists
		const addUserButton = screen.getByText('Add New User');
		expect(addUserButton).toBeTruthy();

		// Check if the users table is rendered
		const usersTable = screen.getByTestId('users-table');
		expect(usersTable).toBeTruthy();

		// Check if the correct number of users are listed in the table
		const userTableRows = screen.getAllByTestId('user-row');
		expect(userTableRows.length).toBe(mockStore.users.length);

		// Simulate clicking the "Add New User" button
		await fireEvent.click(addUserButton);

		// Check if the user creation modal is displayed
		const userCreationModal = screen.getByTestId('user-creation-modal');
		expect(userCreationModal).toBeTruthy();
		expect(userCreationModal).toBeVisible();

		// Check if the "Create Workspace" button exists
		const createWorkspaceButton = screen.getByText('Create Workspace');
		expect(createWorkspaceButton).toBeTruthy();

		// Check if the workspaces table is rendered
		const workspacesTable = screen.getByTestId('workspaces-table');
		expect(workspacesTable).toBeTruthy();

		// Check if the correct number of workspaces are listed in the table
		const workspaceTableRows = screen.getAllByTestId('workspace-row');
		expect(workspaceTableRows.length).toBe(mockStore.workspaces.length);

		// Check if the organization management section exists
		expect(screen.getByTestId('organization-management')).toBeTruthy();

		// Check if the system analytics component is present
		expect(screen.getByTestId('system-analytics')).toBeTruthy();
	});
});
