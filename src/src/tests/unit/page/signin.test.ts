import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';

import SignIn from '$src/routes/(auth)/signin/+page.svelte';

vi.mock('$app/forms', () => ({
	enhance: vi.fn()
}));

const mockMatchMedia = vi.fn().mockImplementation((query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: vi.fn(),
	dispatchEvent: vi.fn(),
	removeListener: vi.fn(),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn()
}));

vi.mock('svelte', async () => {
	const actual = await vi.importActual('svelte');
	return {
		...actual,
		onMount: vi.fn((cb) => cb())
	};
});

describe('SignIn Component', () => {
	beforeEach(() => {
		vi.stubGlobal('window', {
			...window,
			matchMedia: mockMatchMedia
		});

		render(SignIn);
	});

	it('renders the component', () => {
		expect(screen.getByText('ClassConnect')).toBeTruthy();
		expect(screen.getByText('Welcome Back 👋')).toBeTruthy();
	});

	it('renders all form fields', () => {
		expect(screen.getByLabelText('Username')).toBeTruthy();
		expect(screen.getByLabelText('Password')).toBeTruthy();
	});

	it('toggles password visibility', async () => {
		const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
		const toggleButton = screen.getByRole('button', { name: 'Toggle password visibility' });

		expect(passwordInput.type).toBe('password');
		await fireEvent.click(toggleButton);
		expect(passwordInput.type).toBe('text');
		await fireEvent.click(toggleButton);
		expect(passwordInput.type).toBe('password');
	});

	it('displays loading spinner when form is submitted', async () => {
		const submitButton = screen.getByRole('button', { name: 'Sign In' });

		expect(screen.queryByText('Sign In')).toBeTruthy();
		expect(screen.queryByTestId('spinner')).toBeNull();

		await fireEvent.click(submitButton);

		expect(screen.queryByTestId('spinner')).toBeNull();
	});

	it('displays error message when form.error is present', () => {
		render(SignIn, { props: { form: { error: 'Test error message' } } });
		expect(screen.getByText('Test error message')).toBeTruthy();
	});

	it('has a link to the sign-up page', () => {
		const signUpLink = screen.getByRole('link', { name: 'Sign Up' });

		expect(signUpLink).toBeTruthy();
		expect(signUpLink.getAttribute('href')).toBe('/signup');
	});

	it('renders the bookcase image', () => {
		const bookcaseImage = screen.getByAltText('Bookcase');

		expect(bookcaseImage).toBeTruthy();
		expect(bookcaseImage.getAttribute('src')).toBe('/images/bookcase.jpg');
	});
});
