import { render, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from '$lib/components/common/Profile.svelte';
import { getUserData } from '$lib/utils';
import { change } from '$lib/store';

vi.mock('$lib/utils', () => ({
	getUserData: vi.fn()
}));

vi.mock('$lib/store', () => ({
	change: {
		subscribe: vi.fn()
	}
}));

describe('Profile.svelte', () => {
	let user: any;
	let loading: boolean;

	beforeEach(() => {
		vi.resetAllMocks();
		user = {
			name: 'John',
			surname: 'Doe',
			email: 'john.doe@example.com',
			image: 'profile.jpg'
		};
		loading = false;
	});

	it('should render user data correctly', async () => {
		(getUserData as any).mockResolvedValue(user);

		const { getByText, getByAltText, getAllByText } = render(Profile, { props: { user, loading } });

		await waitFor(() => {
			const nameElements = getAllByText('John Doe');
			expect(nameElements.length).toBeGreaterThan(0);
			expect(nameElements[0]).toBeInTheDocument();
			expect(getByText('john.doe@example.com')).toBeInTheDocument();
			expect(getByAltText('User Profile')).toHaveAttribute('src', 'profile.jpg');
		});
	});

	it('should open edit profile modal on button click', async () => {
		(getUserData as any).mockResolvedValue(user);

		const { getByTestId } = render(Profile, { props: { user, loading } });

		const button = getByTestId('editProfileButtonProfile');
		expect(button).toBeInTheDocument(); // Ensure the button is present

		await fireEvent.click(button);

		await waitFor(() => {
			expect(getByTestId('editModalProfile')).toBeInTheDocument();
		});
	});

	it('should open update forms on button click', async () => {
		(getUserData as any).mockResolvedValue(user);

		const { getByTestId } = render(Profile, { props: { user, loading } });

		const button = getByTestId('updatedetailsbtn');
		expect(button).toBeInTheDocument();

		await fireEvent.click(button);

		await waitFor(() => {
			expect(getByTestId('updateforms')).toBeInTheDocument();
		});
	});

	it('should handle keydown event to open edit profile modal', async () => {
		(getUserData as any).mockResolvedValue(user);

		const { getByTestId } = render(Profile, { props: { user, loading } });

		const profileImage = getByTestId('editProfileButtonProfile');
		await fireEvent.keyDown(profileImage, { key: 'Enter' });

		await waitFor(() => {
			expect(getByTestId('editModalProfile')).toBeInTheDocument();
		});
	});

	it('should update user data on mount', async () => {
		(getUserData as any).mockResolvedValue(user);

		render(Profile, { props: { user, loading } });

		await waitFor(() => {
			expect(getUserData).toHaveBeenCalled();
		});
	});

	it('should subscribe to change store and update user data', async () => {
		const mockSubscribe = vi.fn((callback) => callback());
		(change.subscribe as any).mockImplementation(mockSubscribe);
		(getUserData as any).mockResolvedValue(user);

		render(Profile, { props: { user, loading } });

		await waitFor(() => {
			expect(mockSubscribe).toHaveBeenCalled();
			expect(getUserData).toHaveBeenCalledTimes(2); // Once on mount and once on change
		});
	});
});
