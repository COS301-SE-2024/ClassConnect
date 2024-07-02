<script>
	import {
		Navbar,
		DarkMode,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownDivider
	} from 'flowbite-svelte';

	import BreadCrumbs from '$lib/components/utils/universal/+Breadcrumbs.svelte';

	export let data;
	let { name, image } = data;
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
		<DropdownItem href="/student/profile">Profile</DropdownItem>

		<DropdownDivider />

		<DropdownItem>Sign out</DropdownItem>
	</Dropdown>
</Navbar>
