import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Announcements from '$lib/components/universal/+Announcements.svelte';

describe('Announcements Component', () => {
	const sampleAnnouncements = [
		{
			date: '2024-06-01',
			heading: 'Welcome Back!',
			announcement: 'Welcome back to our students for the new semester.'
		},
		{
			date: '2024-06-10',
			heading: 'Upcoming Event',
			announcement: "Don't miss our upcoming event on July 15th."
		}
	];

	it('renders the title and announcements', async () => {
		const { getByText } = render(Announcements, { announcements: sampleAnnouncements });

		// Check if title is rendered
		const titleElement = getByText('Announcements');
		expect(titleElement).toBeInTheDocument();

		// Check if each announcement card is rendered
		sampleAnnouncements.forEach((announcement) => {
			const headingElement = getByText(announcement.heading);
			expect(headingElement).toBeInTheDocument();
		});
	});
});
