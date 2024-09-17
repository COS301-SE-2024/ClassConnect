import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NavbarWorkspaces from '$lib/components/common/Navbar.svelte';

describe('NavbarWorkspaces', () => {
  beforeEach(() => {
    vi.mock('svelte', async () => {
      const actual = await vi.importActual('svelte');
      return {
        ...actual,
        onMount: vi.fn((callback) => callback()),
      };
    });

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock window.location
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      href: '',
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the Navbar component', () => {
    render(NavbarWorkspaces, { props: { role: 'student', activeUrl: '/dashboard' } });
    expect(screen.getByText('ClassConnect')).toBeTruthy();
  });

  it('displays correct links for student role', () => {
    render(NavbarWorkspaces, { props: { role: 'student', activeUrl: '/dashboard' } });
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Workspaces')).toBeTruthy();
    expect(screen.getByText('Announcements')).toBeTruthy();
    expect(screen.getByText('Grades')).toBeTruthy();
  });

  it('displays correct links for lecturer role', () => {
    render(NavbarWorkspaces, { props: { role: 'lecturer', activeUrl: '/workspaces' } });
    expect(screen.getByText('Workspaces')).toBeTruthy();
    expect(screen.getByText('Announcements')).toBeTruthy();
    expect(screen.queryByText('Dashboard')).toBeFalsy();
  });

  it('displays correct links for admin role', () => {
    render(NavbarWorkspaces, { props: { role: 'admin', activeUrl: '/dashboard' } });
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Announcements')).toBeTruthy();
    expect(screen.getByText('Organisation')).toBeTruthy();
    expect(screen.getByText('Workspaces')).toBeTruthy();
    expect(screen.getByText('Admins')).toBeTruthy();
    expect(screen.getByText('Lecturers')).toBeTruthy();
    expect(screen.getByText('Students')).toBeTruthy();
  });

  it('displays common links for all roles', () => {
    render(NavbarWorkspaces, { props: { role: 'student', activeUrl: '/dashboard' } });
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('FAQ')).toBeTruthy();
  });

  it('displays the hamburger menu on small screens', () => {
    window.innerWidth = 800;
    render(NavbarWorkspaces, { props: { role: 'student', activeUrl: '/dashboard' } });
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeTruthy();
  });

  it('does not display the hamburger menu on large screens', () => {
    window.innerWidth = 1024;
    render(NavbarWorkspaces, { props: { role: 'student', activeUrl: '/dashboard' } });
    expect(screen.queryByRole('button', { name: /toggle menu/i })).toBeFalsy();
  });

  it('highlights the active link', () => {
    render(NavbarWorkspaces, { props: { role: 'student', activeUrl: '/dashboard' } });
    const activeLink = screen.getByText('Dashboard').closest('a');
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('redirects to sign out page when sign out button is clicked', () => {
    render(NavbarWorkspaces, { props: { role: 'student', activeUrl: '/dashboard' } });
    const signOutButton = screen.getByText('Sign Out');
    signOutButton.click();
    expect(window.location.href).toBe('/signout');
  });
});