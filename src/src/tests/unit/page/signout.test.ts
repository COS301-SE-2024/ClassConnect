import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import SignOut from '$src/routes/(auth)/signout/+page.svelte';

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
});
