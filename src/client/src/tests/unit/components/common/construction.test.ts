import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Construction from '$lib/components/common/Construction.svelte';

describe('Construction.svelte', () => {
	it('renders the image with correct attributes', async () => {
		render(Construction);

		const img = screen.getByAltText('Logo');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', 'https://www.svgrepo.com/show/426192/cogs-settings.svg');
	});

	it('renders the heading with correct text', async () => {
		render(Construction);

		const heading = screen.getByText('Site is under construction');
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveClass(
			'text-4xl',
			'font-bold',
			'text-gray-700',
			'dark:text-white',
			'md:text-5xl',
			'lg:text-6xl'
		);
	});

	it('renders the paragraph with correct text', async () => {
		render(Construction);

		const paragraph = screen.getByText(
			"We're working hard to improve the user experience. Stay tuned!"
		);
		expect(paragraph).toBeInTheDocument();
		expect(paragraph).toHaveClass(
			'text-lg',
			'text-gray-500',
			'dark:text-gray-300',
			'md:text-xl',
			'lg:text-2xl'
		);
	});
});
