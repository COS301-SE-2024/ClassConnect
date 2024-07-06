<script>
	import {
		Navbar,
		DarkMode,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider
	} from 'flowbite-svelte';
	import BreadCrumbs from '$lib/components/utils/universal/+Breadcrumbs.svelte';
	import { user } from '$lib/store';

	console.log('This is the user class: ', $user);

	const profileUrl = '/' + $user.getRole() + '/profile';
</script>

<Navbar>
	<BreadCrumbs />
	<div class="flex items-center md:order-2">
		<DarkMode class="mx-2 border text-gray-500 dark:border-gray-800 dark:text-gray-600" />
		<Avatar
			id="avatar-menu"
			src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
			class="mx-2"
		/>
		<div class="mx-2">
			<div class="text-lg font-bold">{$user.getFullName()}</div>
			<div class="text-lg font-semibold">{$user.getUsername()}</div>
		</div>
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block text-sm">{$user.getFullName()}</span>
			<span class="block truncate text-sm font-medium">{$user.getEmail()}</span>
		</DropdownHeader>
		<DropdownItem href={profileUrl}>Profile</DropdownItem>
		<DropdownDivider />
		<DropdownItem href="/signout">Sign out</DropdownItem>
	</Dropdown>
</Navbar>
