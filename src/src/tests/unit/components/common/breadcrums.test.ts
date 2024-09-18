import { tick } from 'svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import BreadcrumbComponent from '$lib/components/common/Breadcrumbs.svelte';
import { page } from '$app/stores';
import { workspaces, quizzes } from '$lib/store/user';

vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn()
	}
}));

vi.mock('$app/navigation', () => ({
	afterNavigate: vi.fn()
}));

describe('BreadcrumbComponent', () => {
	const mockMaps = {
		workspacesMap: { '1': 'Workspace 1' },
		quizzesMap: { '2': 'Quiz 2' }
	};

	beforeEach(() => {
		vi.clearAllMocks();
		workspaces.set({});
		quizzes.set({});
	});

	it('renders the component with home breadcrumb', async () => {
		vi.mocked(page.subscribe).mockImplementation((callback) => {
			callback({ url: { pathname: '/' } } as any);
			return () => {};
		});

		render(BreadcrumbComponent, { props: { maps: mockMaps } });
		await tick();

		expect(screen.getByText('Home')).toBeTruthy();
	});

	it('renders correct breadcrumbs for workspace path', async () => {
		vi.mocked(page.subscribe).mockImplementation((callback) => {
			callback({ url: { pathname: '/workspaces/1' } } as any);
			return () => {};
		});

		render(BreadcrumbComponent, { props: { maps: mockMaps } });
		await tick();

		expect(screen.getByText('Home')).toBeTruthy();
		expect(screen.getByText('Workspaces')).toBeTruthy();
	});

	it('renders correct breadcrumbs for quiz path', async () => {
		vi.mocked(page.subscribe).mockImplementation((callback) => {
			callback({ url: { pathname: '/workspaces/1/quizzes/2' } } as any);
			return () => {};
		});

		render(BreadcrumbComponent, { props: { maps: mockMaps } });
		await tick();

		expect(screen.getByText('Home')).toBeTruthy();
		expect(screen.getByText('Workspaces')).toBeTruthy();
		expect(screen.getByText('Quizzes')).toBeTruthy();
	});

	it('uses default names when workspace or quiz is not in the map', async () => {
		vi.mocked(page.subscribe).mockImplementation((callback) => {
			callback({ url: { pathname: '/workspaces/3/quizzes/4' } } as any);
			return () => {};
		});

		render(BreadcrumbComponent, { props: { maps: mockMaps } });
		await tick();

		expect(screen.getByText('Home')).toBeTruthy();
		expect(screen.getByText('Workspaces')).toBeTruthy();
		expect(screen.getByText('Workspace')).toBeTruthy();
		expect(screen.getByText('Quizzes')).toBeTruthy();
		expect(screen.getByText('Quiz')).toBeTruthy();
	});

	it('updates workspaces and quizzes stores when maps change', async () => {
		render(BreadcrumbComponent, { props: { maps: mockMaps } });
		await tick();

		expect(get(workspaces)).toEqual({ '1': 'Workspace 1' });
		expect(get(quizzes)).toEqual({ '2': 'Quiz 2' });
	});
});
