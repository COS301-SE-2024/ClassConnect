<script>
	import { Avatar, Navbar, DarkMode } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { change } from '$lib/store';
	import BreadCrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import { getUserData } from '$lib/utils';

	export let data;

	let { name, image } = data;

	async function updateUserData() {
		try {
			const user = await getUserData();
			name = user.name;
			image = user.image;
		} catch (error) {
			console.error('There was a problem with the get operation:', error);
		}
	}

	onMount(async () => {
		updateUserData();
	});

	$: {
		change.subscribe(async () => {
			await updateUserData();
		});
	}
</script>

<Navbar data-testid="navbar">
	<BreadCrumbs />

	<div class="flex items-center md:order-2">
		<DarkMode
			class="mx-2 border text-gray-500 dark:border-gray-800 dark:text-gray-600"
			data-testid="darkmode"
		/>

		<Avatar id="avatar-menu" src={image} class="mx-2" data-testid="avatar" />

		<div class="mx-2">
			<div class="text-lg font-semibold">{name}</div>
		</div>
	</div>
</Navbar>
