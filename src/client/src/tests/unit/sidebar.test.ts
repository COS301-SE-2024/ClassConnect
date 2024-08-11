import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import Sidebar from '../../lib/components/common/SideBar.svelte';

// Mock $app/stores
vi.mock('$app/stores', () => ({
  page: { subscribe: vi.fn() }
}));

// Mock $app/navigation
vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

describe('Sidebar', () => {
  // Happy path: correct navigation links based on role
  it('displays correct navigation links for admin role', () => {
    render(Sidebar, { props: { role: 'admin' } });

    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Announcements')).toBeDefined();
    expect(screen.getByText('Organisation')).toBeDefined();
    expect(screen.getByText('Workspaces')).toBeDefined();
    expect(screen.getByText('Admins')).toBeDefined();
    expect(screen.getByText('Lecturers')).toBeDefined();
    expect(screen.getByText('Students')).toBeDefined();
  });

  // Edge case: highlight active link based on current URL path
  it('highlights active link based on current URL path', async () => {
    const { component } = render(Sidebar, { props: { role: 'student' } });

    // Simulate navigation to /workspaces
    await goto('/workspaces');

    // Update the page store
    page.set({ url: new URL('http://localhost/workspaces') });

    // Force component update
    component.$set({ role: 'student' });

    const workspacesLink = screen.getByText('Workspaces').closest('a');
    expect(workspacesLink?.classList.contains('active-sidebar')).toBe(true);
  });

  // Happy path: common links displayed for all roles
  it('displays common links for all roles', () => {
    render(Sidebar, { props: { role: 'lecturer' } });

    expect(screen.getByText('Profile')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
    expect(screen.getByText('FAQ')).toBeDefined();
    expect(screen.getByText('Sign Out')).toBeDefined();
  });
});