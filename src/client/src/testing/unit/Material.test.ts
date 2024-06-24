import { render } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import PDFViewer from '$lib/components/student/+Material.svelte';

vi.mock('$lib/store', () => ({
	file: {
		subscribe: vi.fn().mockImplementation((fn) => {
			fn('');
			return () => {};
		}),
		set: vi.fn()
	}
}));

describe('PDFViewer Component', () => {
	it('renders with default PDF URL', async () => {
		const { getByTitle } = render(PDFViewer);

		const pdfObject = getByTitle('Study Material');
		expect(pdfObject).toBeInTheDocument();
		expect(pdfObject).toHaveAttribute(
			'data',
			'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf'
		);
	});
});
