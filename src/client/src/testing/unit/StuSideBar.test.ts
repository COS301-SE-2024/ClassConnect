import { render } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '$lib/components/utils/student/+SideBar.svelte';

vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn().mockImplementation((fn) => {
			fn({ url: { pathname: '/student' } });
			return () => {};
		})
	}
}));

describe('Sidebar Component', () => {
	it('renders the logo and name', () => {
		const { getByText } = render(Sidebar);

		// Check if the name is rendered
		expect(getByText('Class Connect')).toBeInTheDocument();
	});

	it('renders navigation links with correct names and icons', () => {
		const { getByText, container } = render(Sidebar);

		const links = ['Home', 'Grades', 'Activities'];

		links.forEach((link) => {
			expect(getByText(link)).toBeInTheDocument();
		});

		// Check for icons
		const icons = container.querySelectorAll('svg');
		expect(icons.length).toBe(links.length);
	});

	it('applies the active class to the current page link', () => {
		const { container } = render(Sidebar);

		// Check if the active class is applied to the correct link
		const activeLink = container.querySelector('a.active');
		expect(activeLink).toBeInTheDocument();
		expect(activeLink).toHaveAttribute('href', '/student');
	});
});
