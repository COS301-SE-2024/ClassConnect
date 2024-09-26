import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import SignOut from '$src/routes/(auth)/signout/+page.svelte';

const mockMatchMedia = vi.fn().mockImplementation((query) => ({
	media: query,
	matches: false,
	onchange: null,
	addListener: vi.fn(),
	dispatchEvent: vi.fn(),
	removeListener: vi.fn(),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn()
}));

vi.mock('$app/forms', () => ({
	enhance: vi.fn()
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('svelte', async () => {
	const actual = await vi.importActual('svelte');
	return {
		...actual,
		onMount: vi.fn((cb) => cb())
	};
});

describe('SignOut Component', () => {
	beforeEach(() => {
		vi.stubGlobal('window', {
			...window,
			matchMedia: mockMatchMedia
		});

		render(SignOut);
	});

	it('renders the component', () => {
		expect(screen.getByText('Signing Out')).toBeTruthy();
		expect(screen.getByText('Are you sure you want to sign out?')).toBeTruthy();
	});

	it('renders the form buttons', () => {
		expect(screen.getByRole('button', { name: 'Yes, I am sure' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'No, cancel' })).toBeTruthy();
	});
});
