import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import AdminComponent from '../admins/+page.svelte';
import AddModal from '$lib/components/modals/user/Add.svelte';
import RemoveModal from '$lib/components/modals/Delete.svelte';
import EditModal from '$lib/components/modals/user/Edit.svelte';

// Import the User type
import type { User } from '';

// Mock the modal components
vi.mock('$lib/components/modals/user/Add.svelte', () => ({
	default: vi.fn()
}));
vi.mock('$lib/components/modals/Delete.svelte', () => ({
	default: vi.fn()
}));
vi.mock('$lib/components/modals/user/Edit.svelte', () => ({
	default: vi.fn()
}));

describe('AdminComponent', () => {
	const mockAdmins: User[] = [
		{
			id: '1',
			name: 'John',
			surname: 'Doe',
			username: 'johndoe',
			email: 'john@example.com',
			image:
				'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg'
		},
		{
			id: '2',
			name: 'Jane',
			surname: 'Smith',
			username: 'janesmith',
			email: 'jane@example.com',
			image:
				'https://static.vecteezy.com/system/resources/thumbnails/025/067/762/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg'
		}
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders empty state when no admins', () => {
		const { getByText } = render(AdminComponent, {
			data: {
				admins: [],
				image: undefined,
				name: undefined,
				role: undefined
			}
		});
		expect(getByText('Boost Management By Adding Additional Administrators!')).toBeTruthy();
		expect(getByText('Add Your First Administrator')).toBeTruthy();
	});

	it('renders admin list when admins exist', () => {
		const { getByText, getAllByRole } = render(AdminComponent, {
			data: {
				admins: mockAdmins,
				image: undefined,
				name: undefined,
				role: undefined
			}
		});
		expect(getByText('Workspaces')).toBeTruthy();
		expect(getByText('2 admins')).toBeTruthy();
		expect(getAllByRole('row')).toHaveLength(3); // 2 admins + header row
	});

	it('filters admins based on search term', async () => {
		const { getByPlaceholderText, getAllByRole } = render(AdminComponent, {
			data: {
				admins: mockAdmins,
				image: undefined,
				name: undefined,
				role: undefined
			}
		});
		const searchInput = getByPlaceholderText('Search by name');
		await fireEvent.input(searchInput, { target: { value: 'John' } });
		expect(getAllByRole('row')).toHaveLength(2); // 1 admin + header row
	});

	it('opens add modal when "Add Administrator" button is clicked', async () => {
		const { getByText } = render(AdminComponent, {
			data: {
				admins: mockAdmins,
				image: undefined,
				name: undefined,
				role: undefined
			}
		});
		const addButton = getByText('Add Administrator');
		await fireEvent.click(addButton);
		expect(AddModal).toHaveBeenCalledWith(
			expect.objectContaining({ open: true, role: 'Admin' }),
			{}
		);
	});

	it('opens edit modal when edit button is clicked', async () => {
		const { getAllByText } = render(AdminComponent, {
			data: {
				admins: mockAdmins,
				image: undefined,
				name: undefined,
				role: undefined
			}
		});
		const editButtons = getAllByText('Edit');
		await fireEvent.click(editButtons[0]);
		expect(EditModal).toHaveBeenCalledWith(
			expect.objectContaining({ open: true, id: '1', role: 'Admin' }),
			{}
		);
	});

	it('opens remove modal when delete button is clicked', async () => {
		const { getAllByText } = render(AdminComponent, {
			data: {
				admins: mockAdmins,
				image: undefined,
				name: undefined,
				role: undefined
			}
		});
		const deleteButtons = getAllByText('Delete');
		await fireEvent.click(deleteButtons[0]);
		expect(RemoveModal).toHaveBeenCalledWith(
			expect.objectContaining({ open: true, id: '1', item: 'user' }),
			{}
		);
	});

	it('displays correct number of admins', () => {
		const { getByText } = render(AdminComponent, {
			data: {
				admins: mockAdmins,
				image: undefined,
				name: undefined,
				role: undefined
			}
		});
		expect(getByText('2 admins')).toBeTruthy();
	});

	it('displays singular "admin" when only one admin exists', () => {
		const { getByText } = render(AdminComponent, {
			data: {
				admins: [mockAdmins[0]],
				image: undefined,
				name: undefined,
				role: undefined
			}
		});
		expect(getByText('1 admin')).toBeTruthy();
	});

	it('renders admin details correctly', () => {
		const { getByText, getAllByRole } = render(AdminComponent, {
			data: {
				admins: mockAdmins,
				image: undefined,
				name: undefined,
				role: undefined
			}
		});
		const rows = getAllByRole('row');
		expect(getByText('John Doe')).toBeTruthy();
		expect(getByText('johndoe')).toBeTruthy();
		expect(getByText('john@example.com')).toBeTruthy();
		expect(rows[1].querySelector('img')).toHaveAttribute('src', 'john.jpg');
		expect(rows[1].querySelector('img')).toHaveAttribute('alt', 'John Doe');
	});
});
