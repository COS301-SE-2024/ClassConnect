<script>
	import {
		Avatar,
		Navbar,
		DarkMode,
		Dropdown,
		DropdownItem,
		DropdownDivider
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { change } from '$lib/store';
	import BreadCrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import axios from 'axios';

	export let data;

	let { name, image } = data;
	const apiUrl = '/api/user';

	async function getUserData() {
		try {
			await axios
				.get(apiUrl)
				.then((response) => {
					console.log('User data:', response.data);
					const user = response.data;
					name = user.name;
					image = user.image;
				})
				.catch((error) => {
					if (error) {
						console.log('An error occurred');
					}
					// if (error.response) {
					// 	console.error('Error response data:', error.response.data);
					// 	console.error('Error response status:', error.response.status);
					// } else if (error.request) {
					// 	console.error('Error request:', error.request);
					// } else {
					// 	console.error('Error message:', error.message);
					// }
				});
		} catch (error) {
			console.error('There was a problem with the get operation:', error);
		}
	}

	onMount(async () => {
		getUserData();
	});

	$: {
		change.subscribe(async () => {
			await getUserData();
		});
	}
</script>

<Navbar>
	<BreadCrumbs />

	<div class="flex items-center md:order-2">
		<DarkMode class="mx-2 border text-gray-500 dark:border-gray-800 dark:text-gray-600" />

		<Avatar id="avatar-menu" src={image} class="mx-2" />

		<div class="mx-2">
			<div class="text-lg font-semibold">{name}</div>
		</div>
	</div>
</Navbar>
