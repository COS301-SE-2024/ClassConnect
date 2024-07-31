import SignUp from './+page.svelte';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';

vi.mock('$app/forms', () => ({
	enhance: vi.fn()
}));

describe('SignUp Component', () => {
	beforeEach(() => {
		render(SignUp);
	});

	it('renders the component', () => {
		expect(screen.getByText('Class Connect')).toBeTruthy();
		expect(screen.getByText('Get Started Now')).toBeTruthy();
	});

	it('renders all form fields', () => {
		expect(screen.getByLabelText('Name')).toBeTruthy();
		expect(screen.getByLabelText('Surname')).toBeTruthy();
		expect(screen.getByLabelText('Email')).toBeTruthy();
		expect(screen.getByLabelText('Password')).toBeTruthy();
		expect(screen.getByLabelText('Confirm Password')).toBeTruthy();
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
		const submitButton = screen.getByRole('button', { name: 'Sign Up' });

		expect(screen.queryByText('Sign Up')).toBeTruthy();
		expect(screen.queryByTestId('spinner')).toBeNull();

		await fireEvent.click(submitButton);

		expect(screen.queryByTestId('spinner')).toBeNull();
	});

	it('displays error message when form.error is present', () => {
		render(SignUp, { props: { form: { error: 'Test error message' } } });
		expect(screen.getByText('Test error message')).toBeTruthy();
	});

	it('has a link to the sign-in page', () => {
		const signInLink = screen.getByRole('link', { name: 'Sign In' });

		expect(signInLink).toBeTruthy();
		expect(signInLink.getAttribute('href')).toBe('/signin');
	});
});
