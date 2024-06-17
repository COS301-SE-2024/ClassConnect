/** @type {import('./$types').PageLoad} */
import { get } from 'svelte/store';
import { user_details } from '$lib/store';

export function load() {
	const details = get(user_details);
	console.log('User details:', details);
	return {
		modules: [
			{
				module_name: 'Computer Networks',
				module_id: '123456789'
			},
			{
				module_name: 'Computer Graphics',
				module_id: '789123456'
			},
			{
				module_name: 'Programming Languages',
				module_id: '789456123'
			}
		]
	};
}
