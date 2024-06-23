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
export const workChange = writable('change');

export const wrkspcs = writable<any>([]);

export const user = writable('eugene');
export const email = writable('eugene.mpande@tuks.co.za');
export const file = writable('');
export const module = writable('');

export const user_details = writable({});
export const module_details = writable({});
export const username = 'e241198014';

export const userInfo = writable<any>({
	name: 'James',
	surname: 'Guy',
	username: 'e241198014',
	email: 'bond@gg.moc',
	image: 'https://www.pngkey.com/png/full/73-730477_first-name-profile-image-placeholder-png.png',
	role: 'lecturer',
	organisation: '665c341781a011b727589f4c',
	workspaces: []
});
