import { writable } from 'svelte/store';

export const admins = writable<any>([]);
export const students = writable<any>([]);
export const lecturers = writable<any>([]);

export const organisationName = writable('Organisation');
export const lecChange = writable('change');
export const stuChange = writable('change');
export const admChange = writable('change');
