import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import FAQAccordion from '$lib/components/common/FAQ.svelte';

const sampleFaqs = [
	{
		category: 'General Questions',
		items: [
			{ question: 'What is your return policy?', answer: 'You can return items within 30 days.' },
			{ question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide.' }
		]
	},
	{
		category: 'Technical Support',
		items: [{ question: 'How do I reset my password?', answer: 'Click on "Forgot password" link.' }]
	}
];

describe('FAQAccordion', () => {
	it('renders the main heading', () => {
		render(FAQAccordion, { props: { faqs: sampleFaqs } });
		expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
	});

	it('renders categories as headings', () => {
		render(FAQAccordion, { props: { faqs: sampleFaqs } });
		expect(screen.getByText('General Questions')).toBeInTheDocument();
		expect(screen.getByText('Technical Support')).toBeInTheDocument();
	});

	it('renders accordion items', () => {
		render(FAQAccordion, { props: { faqs: sampleFaqs } });
		expect(screen.getByText('What is your return policy?')).toBeInTheDocument();
		expect(screen.getByText('Do you ship internationally?')).toBeInTheDocument();
		expect(screen.getByText('How do I reset my password?')).toBeInTheDocument();
	});

	it('displays the answer when an accordion item is clicked', async () => {
		render(FAQAccordion, { props: { faqs: sampleFaqs } });
		const questionElement = screen.getByText('What is your return policy?');
		await fireEvent.click(questionElement);

		expect(screen.getByText('You can return items within 30 days.')).toBeInTheDocument();
	});

	it('handles empty faqs prop gracefully', () => {
		render(FAQAccordion, { props: { faqs: [] } });
		expect(screen.queryByText('General Questions')).not.toBeInTheDocument();
		expect(screen.queryByText('Technical Support')).not.toBeInTheDocument();
	});
});
