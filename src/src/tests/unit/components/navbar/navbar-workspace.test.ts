import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NavbarWorkspace from '$lib/components/workspaces/workspace/Sidebar.svelte';

// Mock $app/stores
vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn().mockImplementation((fn) => {
      fn({ params: { workspace: 'test-workspace' } });
      return () => {};
    })
  }
}));

describe('NavbarWorkspace', () => {
  const mockWorkspace = { name: 'Test Workspace', image: 'test-image.jpg' };

  beforeEach(() => {
    // Mock window.location
    vi.stubGlobal('location', { href: '' });
  });

  it('renders the Navbar component with workspace name and image', () => {
    render(NavbarWorkspace, { props: { workspace: mockWorkspace, role: 'lecturer' } });
    expect(screen.getByText('Test Workspace')).toBeTruthy();
    expect(screen.getByAltText('Test Workspace logo')).toBeTruthy();
  });

  it('displays correct links for lecturer role', () => {
    render(NavbarWorkspace, { props: { workspace: mockWorkspace, role: 'lecturer' } });
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Management')).toBeTruthy();
    expect(screen.getByText('Resources')).toBeTruthy();
  });

  it('displays correct links for student role', () => {
    render(NavbarWorkspace, { props: { workspace: mockWorkspace, role: 'student' } });
    expect(screen.getByText('Course Work')).toBeTruthy();
    expect(screen.getByText('Additional')).toBeTruthy();
  });

  it('redirects to main page when "Leave" button is clicked', () => {
    render(NavbarWorkspace, { props: { workspace: mockWorkspace, role: 'lecturer' } });
    const leaveButton = screen.getByText('Leave Test Workspace');
    leaveButton.click();
    expect(window.location.href).toBe('/');
  });

  it('renders dropdown for Management links', async () => {
    render(NavbarWorkspace, { props: { workspace: mockWorkspace, role: 'lecturer' } });
    const managementDropdown = screen.getByText('Management');
    expect(managementDropdown).toBeTruthy();
  });

  it('renders dropdown for Course Work links for student', async () => {
    render(NavbarWorkspace, { props: { workspace: mockWorkspace, role: 'student' } });
    const courseWorkDropdown = screen.getByText('Course Work');
    expect(courseWorkDropdown).toBeTruthy();
  });

  it('renders hamburger menu', () => {
    render(NavbarWorkspace, { props: { workspace: mockWorkspace, role: 'lecturer' } });
    const hamburgerMenu = screen.getByRole('button', { name: /toggle menu/i });
    expect(hamburgerMenu).toBeTruthy();
  });
});