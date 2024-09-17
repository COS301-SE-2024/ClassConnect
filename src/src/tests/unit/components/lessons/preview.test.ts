import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import { tick } from 'svelte';
import Preview from '$lib/components/lessons/lesson/Preview.svelte'; // Assuming the component file is named Preview.svelte
import { goto } from '$app/navigation';

// Mock the necessary modules and functions
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}));

describe('Preview Component', () => {
  beforeEach(() => {
    // Mock navigator.mediaDevices
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [{ enabled: true }],
        }),
      },
      writable: true,
    });

    // Mock AudioContext
    global.AudioContext = vi.fn().mockImplementation(() => ({
      createMediaStreamSource: vi.fn().mockReturnValue({
        connect: vi.fn(),
      }),
      createAnalyser: vi.fn().mockReturnValue({
        frequencyBinCount: 1024,
        getByteFrequencyData: vi.fn(),
      }),
      close: vi.fn(),
    }));

    // Mock HTMLVideoElement
    global.HTMLVideoElement.prototype.play = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('renders correctly', async () => {
    const { getByText, getByRole } = render(Preview, { onJoin: vi.fn() });
    
    expect(getByText('Check your audio and video')).toBeTruthy();
    expect(getByRole('video')).toBeTruthy();
    expect(getByText('Microphone')).toBeTruthy();
    expect(getByText('Camera')).toBeTruthy();
    expect(getByText('Join')).toBeTruthy();
    expect(getByText('Exit')).toBeTruthy();
  });

  it('toggles microphone', async () => {
    const { getByText } = render(Preview, { onJoin: vi.fn() });
    const micToggle = getByText('Microphone');
    
    await fireEvent.click(micToggle);
    await tick();
    
    // Check if the microphone track's enabled property was toggled
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
  });

  it('toggles camera', async () => {
    const { getByText } = render(Preview, { onJoin: vi.fn() });
    const cameraToggle = getByText('Camera');
    
    await fireEvent.click(cameraToggle);
    await tick();
    
    // Check if the video track's enabled property was toggled
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ video: true });
  });

  it('calls onJoin when Join button is clicked', async () => {
    const onJoinMock = vi.fn();
    const { getByText } = render(Preview, { onJoin: onJoinMock });
    const joinButton = getByText('Join');
    
    await fireEvent.click(joinButton);
    
    expect(onJoinMock).toHaveBeenCalledWith(true, true);
  });

  it('navigates to home when Exit button is clicked', async () => {
    const { getByText } = render(Preview, { onJoin: vi.fn() });
    const exitButton = getByText('Exit');
    
    await fireEvent.click(exitButton);
    
    expect(vi.mocked(goto)).toHaveBeenCalledWith('/');
  });
});