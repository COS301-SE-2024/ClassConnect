import { writable } from 'svelte/store';

export const admins = writable<any>([]);
export const students = writable<any>([]);
export const lecturers = writable<any>([]);

export const lessons = writable<any>([
	{ topic: 'Science', date: '16 June', time: '10:30' },
	{ topic: 'History', date: '17 June', time: '11:30' },
	{ topic: 'Geography', date: '18 June', time: '12:30' },
	{ topic: 'Technology', date: '19 June', time: '13:30' }
]);

export const organisationName = writable('Organisation');
export const lecChange = writable('change');
export const stuChange = writable('change');
export const admChange = writable('change');
