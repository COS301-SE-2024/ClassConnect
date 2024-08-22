import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';

import ForgotPassword from '$src/routes/(auth)/forgot-password/+page.svelte';

vi.mock('$app/forms', () => ({
	enhance: vi.fn()
}));

describe('ForgotPassword Component', () => {
	beforeEach(() => {
		render(ForgotPassword, { props: { form: {} } });
	});

	it('renders the component', () => {
		expect(screen.getByText('ClassConnect')).toBeTruthy();
	});

	it('renders the form with all fields', () => {
		expect(screen.getByLabelText('Email')).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeTruthy();
	});

	it('displays success message when form.success is present', () => {
		render(ForgotPassword, { props: { form: { success: 'Success! Check your email.' } } });
		expect(screen.getByText('Success! Check your email.')).toBeTruthy();
	});

	it('displays error message when form.error is present', () => {
		render(ForgotPassword, { props: { form: { error: 'Error occurred.' } } });
		expect(screen.getByText('Error occurred.')).toBeTruthy();
	});

	it('renders the ClassConnect logo', () => {
		const logo = screen.getByAltText('ClassConnect logo');
		expect(logo).toBeTruthy();
		expect(logo.getAttribute('src')).toBe('/images/class-connect-logo.png');
	});
});
