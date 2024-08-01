import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import WorkspaceComponent from '$lib/components/workspaces/Admin.svelte';

// Mock the imported components and icons
vi.mock('flowbite-svelte', () => ({
  Card: vi.fn(),
  Button: vi.fn(),
  TableHead: vi.fn(),
  TableHeadCell: vi.fn(),
  TableBody: vi.fn(),
  TableBodyRow: vi.fn(),
  TableBodyCell: vi.fn(),
  TableSearch: vi.fn(),
}));

vi.mock('flowbite-svelte-icons', () => ({
  ArrowRightOutline: vi.fn(),
  EditOutline: vi.fn(),
  TrashBinOutline: vi.fn(),
}));

vi.mock('$lib/components/modals/Delete.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('$lib/components/modals/workspace/Add.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('$lib/components/modals/workspace/Edit.svelte', () => ({
  default: vi.fn(),
}));

describe('WorkspaceComponent', () => {
  let mockData: {
    lecturers: { id: string; name: string; email: string; }[];
    workspaces: { id: string; name: string; owner: string; image: string; }[];
  };

  beforeEach(() => {
    mockData = {
      lecturers: [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
      workspaces: [
        { id: '1', name: 'Workspace 1', owner: 'John Doe', image: 'image1.jpg' },
        { id: '2', name: 'Workspace 2', owner: 'Jane Smith', image: 'image2.jpg' },
      ],
    };
  });

  it('renders correctly when there are no workspaces', () => {
    const { getByText } = render(WorkspaceComponent, { data: { ...mockData, workspaces: [] } });
    expect(getByText('Boost Productivity With Workspaces Now!')).toBeTruthy();
    expect(getByText('Create Your First Workspace')).toBeTruthy();
  });

  it('renders correctly when there are workspaces', () => {
    const { getByText, getAllByText } = render(WorkspaceComponent, { data: mockData });
    expect(getByText('Workspaces')).toBeTruthy();
    expect(getByText('2 workspaces')).toBeTruthy();
    const workspace1Elements = getAllByText('Workspace 1');
    const workspace2Elements = getAllByText('Workspace 2');
    expect(workspace1Elements.length).toBeGreaterThan(0);
    expect(workspace2Elements.length).toBeGreaterThan(0);
  });

  it('opens add modal when "Add Workspace" button is clicked', async () => {
    const { getByText } = render(WorkspaceComponent, { data: mockData });
    const addButton = getByText('Add Workspace');
    await fireEvent.click(addButton);
  });

  it('opens edit modal when edit button is clicked', async () => {
    const { getByText } = render(WorkspaceComponent, { data: mockData });
    const editButton = getByText('Edit');
    await fireEvent.click(editButton);
    // Check if EditModal is open
  });

  it('opens remove modal when delete button is clicked', async () => {
    const { getByText } = render(WorkspaceComponent, { data: mockData });
    const deleteButton = getByText('Delete');
    await fireEvent.click(deleteButton);
    // Check if RemoveModal is open
  });

  it('filters workspaces based on search term', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(WorkspaceComponent, { data: mockData });
    const searchInput = getByPlaceholderText('Search by workspace');
    await fireEvent.input(searchInput, { target: { value: 'Workspace 1' } });
    expect(getByText('Workspace 1')).toBeTruthy();
    expect(queryByText('Workspace 2')).toBeNull();
  });
});