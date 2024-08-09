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

	export let data;

	let { name, image } = data;

	async function getUserData() {
		try {
			const formData = new FormData();
			const response = await fetch('/settings?/get_user_details', {
				method: 'POST',
				body: formData
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			if (data.data) {
				const input = data.data;
				const innerString = JSON.parse(input)[0];
				const user_data = JSON.parse(innerString);
				const user = user_data.user;
				name = user.name;
				image = user.image;
			}
		} catch (error) {
			console.error('There was a problem in the fetch operation:', error);
		}
	}

	onMount(() => {
		getUserData();
	});

	$: {
		change.subscribe(() => {
			getUserData();
		});
	}
</script>

<Navbar>
	<BreadCrumbs />

	<div class="flex items-center md:order-2">
		<DarkMode class="mx-2 border text-gray-500 dark:border-gray-800 dark:text-gray-600" />

		<Avatar id="avatar-menu" src={image} class="mx-2 cursor-pointer" />

		<div class="mx-2">
			<div class="text-lg font-semibold">{name}</div>
		</div>
	</div>

	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownItem href="/profile">Profile</DropdownItem>
		<DropdownDivider />
		<DropdownItem href="/signout">Sign Out</DropdownItem>
	</Dropdown>
</Navbar>
