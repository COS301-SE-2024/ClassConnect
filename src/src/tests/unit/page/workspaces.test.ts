import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Workspaces from './Workspaces.svelte';

describe('Workspaces', () => {
  beforeEach(() => {
    // Mock window methods and properties
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));

    vi.stubGlobal('innerHeight', 1000);

    // Mock document methods
    document.querySelector = vi.fn().mockReturnValue({ offsetHeight: 100 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the Workspaces component', () => {
    const { container } = render(Workspaces, { props: { data: { workspaces: [], role: 'student' } } });
    expect(container.querySelector('main')).toBeTruthy();
    expect(screen.getByText('Workspaces')).toBeTruthy();
  });

  it('displays message when no workspaces are available', () => {
    render(Workspaces, { props: { data: { workspaces: [], role: 'student' } } });
    expect(screen.getByText("You haven't been assigned to any workspaces yet.")).toBeTruthy();
  });

  it('renders workspace cards when workspaces are available', () => {
    const mockWorkspaces = [
      { id: '1', name: 'Workspace 1', image: 'image1.jpg' },
      { id: '2', name: 'Workspace 2', image: 'image2.jpg' },
    ];
    render(Workspaces, { props: { data: { workspaces: mockWorkspaces, role: 'student' } } });
    expect(screen.getByText('Workspace 1')).toBeTruthy();
    expect(screen.getByText('Workspace 2')).toBeTruthy();
  });

  it('calculates content height correctly', () => {
    const { container } = render(Workspaces, { props: { data: { workspaces: [], role: 'student' } } });
    const contentDiv = container.querySelector('.rounded-xl');
    expect(contentDiv).toBeTruthy();
    expect(contentDiv?.getAttribute('style')).toContain('height: 852px');  // 1000 - 100 - 48
  });

  it('generates floating elements', () => {
    const { container } = render(Workspaces, { props: { data: { workspaces: [], role: 'student' } } });
    const floatingElements = container.querySelectorAll('.animate-float');
    expect(floatingElements.length).toBe(20);
  });

  it('updates theme based on system preference', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));

    render(Workspaces, { props: { data: { workspaces: [], role: 'student' } } });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

});