<script lang="ts">
	import { Avatar, Navbar, DarkMode } from 'flowbite-svelte';

	import BreadCrumbs from '$lib/components/common/Breadcrumbs.svelte';

	export let data;
	let { name, image } = data;
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
