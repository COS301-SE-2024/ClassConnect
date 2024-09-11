<script>
	import { Avatar, Navbar, DarkMode } from 'flowbite-svelte';
	import BreadCrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import { change } from '$lib/store';
	import { getUserData } from '$lib/utils';
	import { onMount } from 'svelte';

	export let data;

	$: ({ name, image, maps } = data);

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

<!-- Wrapping the Navbar in a div with a right margin -->
<div class="mr-4">
	<Navbar
		data-testid="navbar"
		class="mb-4 mt-4 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-gray-900"
	>
		<BreadCrumbs {maps} />

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
</div>
