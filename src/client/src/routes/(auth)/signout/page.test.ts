import SignOut from './+page.svelte';

import { goto } from '$app/navigation';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';

vi.mock('$app/forms', () => ({
	enhance: vi.fn()
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('SignOut Component', () => {
	beforeEach(() => {
		render(SignOut);
	});

	it('renders the component', () => {
		expect(screen.getByText('Sign Out')).toBeTruthy();
		expect(screen.getByText('Are you sure you want to sign out?')).toBeTruthy();
	});

	it('renders the form buttons', () => {
		expect(screen.getByRole('button', { name: 'Yes, I am sure' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'No, cancel' })).toBeTruthy();
	});

	it('redirects to home on cancel button click', async () => {
		const cancelButton = screen.getByRole('button', { name: 'No, cancel' });

		await fireEvent.click(cancelButton);

		expect(goto).toHaveBeenCalledWith('/home');
	});
});
