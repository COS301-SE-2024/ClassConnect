import { writable } from 'svelte/store';

interface Map {
	[key: string]: string;
}

export const quizzes = writable<Map>({});
export const workspaces = writable<Map>({});
