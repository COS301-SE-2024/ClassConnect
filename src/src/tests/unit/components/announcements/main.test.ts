import { tick } from 'svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';

import Main from '$lib/components/announcements/Main.svelte';

const mockData = {
	id: '1',
	role: 'admin',
	announcements: []
};

beforeEach(() => {
	vi.clearAllMocks();
});

describe('Main.svelte', () => {
	it('renders no announcements message', async () => {
		render(Main, { data: mockData, view: 'admin' });

		await tick();

		expect(screen.getByText('No Announcements Found')).toBeInTheDocument();
		expect(screen.getByText('Create Announcement')).toBeInTheDocument();
	});

	it('renders announcements', async () => {
		const dataWithAnnouncements = {
			...mockData,
			announcements: [
				{ id: '1', title: 'Announcement 1' },
				{ id: '2', title: 'Announcement 2' }
			]
		};
		render(Main, { data: dataWithAnnouncements, view: 'admin' });

		await tick();

		expect(screen.getByText('Announcements')).toBeInTheDocument();
		expect(screen.getByText('2 announcements')).toBeInTheDocument();
		expect(screen.getByText('Create Announcement')).toBeInTheDocument();
		expect(screen.getAllByText(/Announcement \d/)).toHaveLength(2);
	});

	it('opens modal on button click', async () => {
		render(Main, { data: mockData, view: 'admin' });

		await tick();

		const button = screen.getByText('Create Announcement');
		await fireEvent.click(button);

		await tick();

		expect(screen.getByText('Title')).toBeInTheDocument();
	});
});
