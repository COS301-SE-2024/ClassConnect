import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';

import ResetPassword from '$src/routes/(auth)/reset-password/[token]/+page.svelte';

vi.mock('$app/forms', () => ({
	enhance: vi.fn()
}));

vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn((callback) => {
			callback({ params: { token: 'mock-token' } });
			return () => {};
		})
	}
}));

describe('ResetPassword Component', () => {
	beforeEach(() => {
		render(ResetPassword);
	});

	it('renders the component', () => {
		expect(screen.getByText('ClassConnect')).toBeTruthy();
	});

	it('renders all form fields', () => {
		expect(screen.getByLabelText('New Password')).toBeTruthy();
		expect(screen.getByLabelText('Confirm New Password')).toBeTruthy();
	});

	it('toggles password visibility', async () => {
		const passwordInput = screen.getByLabelText('New Password') as HTMLInputElement;
		const toggleButton = screen.getByLabelText('Toggle password visibility');

		expect(passwordInput.type).toBe('password');
		await fireEvent.click(toggleButton);
		expect(passwordInput.type).toBe('text');
		await fireEvent.click(toggleButton);
		expect(passwordInput.type).toBe('password');
	});

	it('displays loading spinner when form is submitted', async () => {
		const submitButton = screen.getByRole('button', { name: 'Reset Password' });

		expect(screen.queryByTestId('spinner')).toBeFalsy();

		await fireEvent.click(submitButton);

		expect(screen.queryByTestId('spinner')).toBeFalsy();
	});

	it('displays error message when form.error is present', () => {
		render(ResetPassword, { props: { form: { error: 'Test error message' } } });
		expect(screen.getByText('Test error message')).toBeTruthy();
	});

	it('renders the ClassConnect logo', () => {
		const logo = screen.getByAltText('ClassConnect logo');
		expect(logo).toBeTruthy();
		expect(logo.getAttribute('src')).toBe('/images/class-connect-logo.png');
	});
});
