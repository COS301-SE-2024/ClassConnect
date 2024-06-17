// test/CallControls.test.js
import { goto } from '$app/navigation';
import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';
import ControlPanel from '$lib/components/lesson/ControlPanel.svelte';

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}));

expect.extend({ toBeInTheDocument });

describe('CallControls', () => {
  let component : any;

  beforeEach(() => {
    component = render(ControlPanel);
  });

  it('renders all buttons', () => {
    const { getByText } = component;
    expect(getByText('Mic')).toBeInTheDocument();
    expect(getByText('Camera')).toBeInTheDocument();
    expect(getByText('Share Screen')).toBeInTheDocument();
    expect(getByText('End Call')).toBeInTheDocument();
  });

  it('ends call and navigates to lessons on click', async () => {
    const endCallButton = component.getByText('End Call');
    await fireEvent.click(endCallButton);
    expect(goto).toHaveBeenCalledWith('/lessons');
  });
});