import { goto } from '$app/navigation';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';

import InSession from '$lib/components/lessons/CombinedLessons.svelte';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn().mockImplementation((callback) => {
			callback({ url: '/current/path' });
			return () => {};
		})
	}
}));

describe('InSession Component', () => {
	const lessons = [
		{
			topic: 'Test Topic',
			description: 'Test Description',
			date: '2023-10-01',
			time: '10:00 AM',
			id: '12345'
		}
	];

	const role = 'lecturer';

	it('renders lesson details correctly', () => {
		const { getByText } = render(InSession, { props: { lessons, role } });

		expect(getByText('Test Topic')).toBeInTheDocument();
		expect(getByText('Test Description')).toBeInTheDocument();
		expect(getByText('2023-10-01')).toBeInTheDocument();
		expect(getByText('10:00 AM')).toBeInTheDocument();
	});

	it('handles Join button click', async () => {
		const { getByText } = render(InSession, { props: { lessons, role } });
		const joinButton = getByText('View');

		await fireEvent.click(joinButton);

		expect(goto).toHaveBeenCalledWith('/current/path/12345');
	});

	it('renders lecturer-specific buttons', () => {
		const { getByText } = render(InSession, { props: { lessons, role } });

		expect(getByText('View')).toBeInTheDocument();
		expect(getByText('Cancel')).toBeInTheDocument();
	});
});
