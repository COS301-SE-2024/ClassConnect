import { writable } from 'svelte/store';

//TODO: Be Weary of This!
export const displayedSandboxObjectURL = writable<string>('');
export const objURL = writable<string>('');
export const fullscreenlog = writable<string>('');
export const ObjInScene = writable<boolean>(false);
