import { tick } from 'svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';

import AnnouncementComponent from '$lib/components/announcements/Card.svelte';

beforeEach(() => {
	vi.clearAllMocks();
});

describe('AnnouncementComponent', () => {
	const mockAnnouncement = {
		id: '1',
		title: 'Test Announcement',
		content: 'This is a test announcement',
		date: '2024-08-10T12:00:00Z',
		createdBy: 'Test User'
	};

	it('renders the component with correct announcement details', async () => {
		render(AnnouncementComponent, {
			props: {
				role: 'student',
				announcement: mockAnnouncement
			}
		});

		await tick();

		expect(screen.getByTestId('announcement-title').textContent).toBe('Test Announcement');
		expect(screen.getByTestId('announcement-content').textContent).toBe(
			'This is a test announcement'
		);
		expect(screen.getByTestId('announcement-date').textContent).toMatch(/Aug 10 2024/);
		expect(screen.getByTestId('announcement-author').textContent).toBe('By: Test User');
	});

	it('does not show edit/delete options for student role', async () => {
		render(AnnouncementComponent, {
			props: {
				role: 'student',
				announcement: mockAnnouncement
			}
		});

		await tick();

		expect(screen.queryByTestId('dots-menu')).toBeNull();
	});

	it('shows edit/delete options for lecturer role', async () => {
		render(AnnouncementComponent, {
			props: {
				role: 'lecturer',
				announcement: mockAnnouncement
			}
		});

		await tick();

		expect(screen.getByTestId('dots-menu')).toBeTruthy();
	});

	it('shows edit/delete options for admin role', async () => {
		render(AnnouncementComponent, {
			props: {
				role: 'admin',
				announcement: mockAnnouncement
			}
		});

		await tick();

		expect(screen.getByTestId('dots-menu')).toBeTruthy();
	});

	it('opens dropdown when dots menu is clicked', async () => {
		render(AnnouncementComponent, {
			props: {
				role: 'lecturer',
				announcement: mockAnnouncement
			}
		});

		await tick();

		const dotsMenu = screen.getByTestId('dots-menu');
		await fireEvent.click(dotsMenu);

		await tick();

		expect(screen.getByTestId('edit-option')).toBeTruthy();
		expect(screen.getByTestId('delete-option')).toBeTruthy();
	});
});
