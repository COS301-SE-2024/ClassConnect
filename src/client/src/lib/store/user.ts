import { writable } from 'svelte/store';

export const name = writable<string>('');
export const surname = writable<string>('');
export const username = writable<string>('');
export const image = writable<string>('');
export const role = writable<string>('');
