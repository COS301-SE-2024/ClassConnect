import { writable } from 'svelte/store';
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Welcome from '$src/routes/(auth)/signup/successful/+page.svelte';

vi.mock('svelte', async () => {
	const actual = await vi.importActual('svelte');

	return {
		...actual,
		onMount: vi.fn((callback) => callback())
	};
});

vi.mock('$app/stores', () => ({
	page: writable({
		url: {
			searchParams: new URLSearchParams('name=John')
		}
	})
}));

vi.mock('canvas-confetti', () => ({
	default: vi.fn()
}));

describe('Welcome Component', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it('renders welcome message with name from URL', () => {
		render(Welcome);
		expect(screen.getByText('👋 Welcome aboard John!')).toBeTruthy();
	});

	it('renders success message', () => {
		render(Welcome);
		expect(screen.getByText('Your account has been successfully created.')).toBeTruthy();
	});

	it('renders email notification message', () => {
		render(Welcome);
		expect(
			screen.getByText(
				"We've sent you an email with your new username and sign in and create your organisation."
			)
		).toBeTruthy();
	});

	it('renders community message', () => {
		render(Welcome);
		expect(screen.getByText('We are glad to have you as part of our community!')).toBeTruthy();
	});

	it('triggers confetti animation', async () => {
		const mockConfetti = (await import('canvas-confetti')).default;

		render(Welcome);

		vi.advanceTimersByTime(100);

		expect(mockConfetti).toHaveBeenCalled();
	});

	it('stops confetti animation after duration', async () => {
		const mockConfetti = (await import('canvas-confetti')).default;

		render(Welcome);

		vi.advanceTimersByTime(5000);
		expect(mockConfetti).toHaveBeenCalledTimes(99);

		vi.advanceTimersByTime(1000);
		expect(mockConfetti).toHaveBeenCalledTimes(99);
	});
});
