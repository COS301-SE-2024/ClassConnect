import { writable } from 'svelte/store';

export const admins = writable<any>([]);
export const organisationName = writable('Organisation');
