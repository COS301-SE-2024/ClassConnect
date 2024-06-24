import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Task from '$lib/components/utils/universal/cards/+AnnCard.svelte';

describe('Task Component', () => {
	const props = {
		date: '2024-06-24',
		heading: 'Sample Heading',
		announcement: 'This is a sample announcement.'
	};

	it('renders the heading', () => {
		const { getByText } = render(Task, { props });
		expect(getByText(props.heading)).toBeInTheDocument();
	});

	it('renders the announcement', () => {
		const { getByText } = render(Task, { props });
		expect(getByText(props.announcement)).toBeInTheDocument();
	});

	it('renders the date', () => {
		const { getByText } = render(Task, { props });
		expect(getByText(props.date)).toBeInTheDocument();
	});

	it('renders the options button with SVG', () => {
		const { container } = render(Task, { props });
		const button = container.querySelector('.options');
		expect(button).toBeInTheDocument();
		const svg = button?.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});
});
