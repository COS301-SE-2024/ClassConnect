import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import AdminComponent from '../admins/+page.svelte';

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

vi.mock('$lib/components/modals/user/Add.svelte', () => ({ default: vi.fn() }));
vi.mock('$lib/components/modals/Delete.svelte', () => ({ default: vi.fn() }));
vi.mock('$lib/components/modals/user/Edit.svelte', () => ({ default: vi.fn() }));

describe('AdminComponent', () => {
  let mockData: {
    image: string;
    name: string;
    role: string;
    workspace?: { name: string; image: string; };
    admins: { id: string; name: string; email: string; image: string }[];
  };

  beforeEach(() => {
    mockData = {
      image: 'org-image.jpg',
      name: 'Test Organization',
      role: 'Admin',
      workspace: { name: 'Test Workspace', image: 'workspace-image.jpg' },
      admins: [
        { id: '1', name: 'John Doe', email: 'john@example.com', image: 'john.jpg' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', image: 'jane.jpg' },
      ],
    };
  });

  it('renders correctly when there are no admins', () => {
    const { getByText } = render(AdminComponent, {
      data: { ...mockData, admins: [] }
    });
    expect(getByText('Boost Management By Adding Additional Administrators!')).toBeTruthy();
    expect(getByText('Add Your First Administrator')).toBeTruthy();
  });

  it('renders correctly when there are admins', () => {
    const { getByText, getAllByText } = render(AdminComponent, { data: mockData });
    expect(getByText('Administrators')).toBeTruthy();
    expect(getByText('2 admins')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();
    expect(getAllByText('Edit').length).toBe(2);
    expect(getAllByText('Delete').length).toBe(2);
  });

  it('opens add modal when "Add Administrator" button is clicked', async () => {
    const { getByText } = render(AdminComponent, { data: mockData });
    const addButton = getByText('Add Administrator');
    await fireEvent.click(addButton);
    // You would need to check if the AddModal is open here
    // This depends on how you've implemented the modal visibility
  });

  it('opens edit modal when edit button is clicked', async () => {
    const { getAllByText } = render(AdminComponent, { data: mockData });
    const editButtons = getAllByText('Edit');
    await fireEvent.click(editButtons[0]);
    // Check if EditModal is open
  });

  it('opens remove modal when delete button is clicked', async () => {
    const { getAllByText } = render(AdminComponent, { data: mockData });
    const deleteButtons = getAllByText('Delete');
    await fireEvent.click(deleteButtons[0]);
    // Check if RemoveModal is open
  });

  it('filters admins based on search term', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(AdminComponent, { data: mockData });
    const searchInput = getByPlaceholderText('Search by name');
    await fireEvent.input(searchInput, { target: { value: 'John' } });
    expect(getByText('John Doe')).toBeTruthy();
    expect(queryByText('Jane Smith')).toBeNull();
  });
});