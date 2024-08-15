export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33')
];

export const server_loads = [2];

export const dictionary = {
		"/": [~3],
		"/(app)/admins": [~4,[2]],
		"/(app)/announcements": [~5,[2]],
		"/(app)/dashboard": [~6,[2]],
		"/(app)/faq": [~7,[2]],
		"/(app)/grades": [~8,[2]],
		"/(app)/lecturers": [~9,[2]],
		"/(app)/organisation": [~10,[2]],
		"/(app)/profile": [~11,[2]],
		"/(app)/settings": [~12,[2]],
		"/(auth)/signin": [~30],
		"/(auth)/signout": [~31],
		"/(auth)/signup": [~32],
		"/(auth)/signup/successful": [33],
		"/(app)/students": [~13,[2]],
		"/(app)/workspaces": [~14,[2]],
		"/(app)/workspaces/[workspace]/activities": [~15,[2]],
		"/(app)/workspaces/[workspace]/analytics": [~16,[2]],
		"/(app)/workspaces/[workspace]/announcements": [~17,[2]],
		"/(app)/workspaces/[workspace]/dashboard": [~18,[2]],
		"/(app)/workspaces/[workspace]/environments": [19,[2]],
		"/(app)/workspaces/[workspace]/environments/sandbox": [~20],
		"/(app)/workspaces/[workspace]/gradecenter": [~21,[2]],
		"/(app)/workspaces/[workspace]/grades": [~22,[2]],
		"/(app)/workspaces/[workspace]/lessons": [~23,[2]],
		"/(app)/workspaces/[workspace]/lessons/video": [25,[2]],
		"/(app)/workspaces/[workspace]/lessons/[lesson]": [~24],
		"/(app)/workspaces/[workspace]/materials": [~26,[2]],
		"/(app)/workspaces/[workspace]/materials/material": [27,[2]],
		"/(app)/workspaces/[workspace]/quizzes": [~28,[2]],
		"/(app)/workspaces/[workspace]/quizzes/[quiz]": [~29,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';