import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import PDFViewer from '$lib/components/utils/universal/cards/+StudyCard.svelte';
import { file } from '$lib/store';
import { goto } from '$app/navigation';

vi.mock('$lib/store', () => ({
	file: {
		set: vi.fn()
	}
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('PDFViewer Component', () => {
	const props = {
		title: 'Sample Title',
		description: 'This is a sample description.',
		link: 'sample-link.pdf'
	};

	it('renders the title and description', () => {
		const { getByText } = render(PDFViewer, { props });
		expect(getByText(props.title)).toBeInTheDocument();
		expect(getByText(props.description)).toBeInTheDocument();
	});

	it('renders the image with correct src and alt attributes', () => {
		const { getByAltText } = render(PDFViewer, { props });
		const img = getByAltText('PDF preview');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', '/src/lib/images/pdf-cover.svg');
	});

	it('handles button click to open PDF', async () => {
		const { getByText } = render(PDFViewer, { props });
		const button = getByText('Open PDF');

		await fireEvent.click(button);

		expect(file.set).toHaveBeenCalledWith(props.link);
		expect(goto).toHaveBeenCalledWith('/student/module/study/material');
	});
});
