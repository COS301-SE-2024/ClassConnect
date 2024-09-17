import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Card from '$lib/components/workspaces/workspace/Card.svelte';

// Mock $app/navigation
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('Card', () => {
	const mockWorkspace = {
		id: '1',
		name: 'Test Workspace',
		image: 'test-image.jpg',
		description: 'This is a test workspace'
	};

	it('renders the Card component with correct content', () => {
		render(Card, { props: { workspace: mockWorkspace, role: 'student' } });

		expect(screen.getByText('Test Workspace')).toBeTruthy();
		expect(screen.getByText('This is a test workspace')).toBeTruthy();
		expect(screen.getByAltText('Test Workspace')).toBeTruthy();
		expect(screen.getByRole('button', { name: /Open/i })).toBeTruthy();
	});

	it('navigates to correct URL for student role when button is clicked', async () => {
		const { goto } = await import('$app/navigation');
		render(Card, { props: { workspace: mockWorkspace, role: 'student' } });

		const openButton = screen.getByRole('button', { name: /Open/i });
		await fireEvent.click(openButton);

		expect(goto).toHaveBeenCalledWith('/workspaces/1/announcements');
	});

	it('navigates to correct URL for lecturer role when button is clicked', async () => {
		const { goto } = await import('$app/navigation');
		render(Card, { props: { workspace: mockWorkspace, role: 'lecturer' } });

		const openButton = screen.getByRole('button', { name: /Open/i });
		await fireEvent.click(openButton);

		expect(goto).toHaveBeenCalledWith('/workspaces/1/dashboard');
	});

	it('applies hover styles to image', async () => {
		const { container } = render(Card, { props: { workspace: mockWorkspace, role: 'student' } });

		const image = container.querySelector('img');
		expect(image).toBeTruthy();
		expect(image?.classList.contains('group-hover:scale-110')).toBeTruthy();
	});

	it('applies correct background styles', () => {
		const { container } = render(Card, { props: { workspace: mockWorkspace, role: 'student' } });

		const backgroundDiv = container.querySelector('.absolute.inset-0');
		expect(backgroundDiv).toBeTruthy();
		expect(backgroundDiv?.classList.contains('bg-gradient-to-br')).toBeTruthy();
		expect(backgroundDiv?.classList.contains('backdrop-blur-md')).toBeTruthy();
		expect(backgroundDiv?.classList.contains('group-hover:backdrop-blur-lg')).toBeTruthy();
	});

	it('applies correct button styles', () => {
		render(Card, { props: { workspace: mockWorkspace, role: 'student' } });

		const button = screen.getByRole('button', { name: /Open/i });
		expect(button.classList.contains('bg-gradient-to-r')).toBeTruthy();
		expect(button.classList.contains('from-green-400')).toBeTruthy();
		expect(button.classList.contains('to-emerald-600')).toBeTruthy();
	});
});
