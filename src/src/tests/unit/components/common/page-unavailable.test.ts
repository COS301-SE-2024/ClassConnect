import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import PageUnavailable from '$lib/components/common/PageUnavailable.svelte';

describe('PageUnavailable Component', () => {
	it('renders the main heading', () => {
		render(PageUnavailable);
		expect(
			screen.getByRole('heading', { level: 1, name: 'Page Unavailable.' })
		).toBeInTheDocument();
	});

	it('renders the subheading', () => {
		render(PageUnavailable);
		expect(screen.getByText('Please Create an Organisation to get started!')).toBeInTheDocument();
	});

	it('renders the image with correct attributes', () => {
		render(PageUnavailable);
		const img = screen.getByAltText('Logo') as HTMLImageElement;
		expect(img).toBeInTheDocument();
		expect(img.src).toBe('https://www.svgrepo.com/show/195897/minus.svg');
		expect(img.className).toContain('mb-8 h-40');
	});

	it('applies the correct styles to the container div', () => {
		render(PageUnavailable);
		const containerDiv = screen.getByTestId('page-unavailable-container');
		expect(containerDiv).toBeInTheDocument();
		expect(containerDiv.className).toContain(
			'm-12 flex min-h-screen flex-col items-center justify-center rounded-lg bg-white p-12 shadow-lg dark:bg-gray-700'
		);
	});
});
