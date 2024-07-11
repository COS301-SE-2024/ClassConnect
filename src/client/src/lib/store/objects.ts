import { writable } from 'svelte/store';

//TODO: Be Weary of This!
export const displayedSandboxObjectURL = writable<string>('');