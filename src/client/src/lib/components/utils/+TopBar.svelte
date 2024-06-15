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
</script>

<Navbar>
	<BreadCrumbs />
	<div class="flex items-center md:order-2">
		<DarkMode 
			class="text-gray-500 dark:text-gray-600 border dark:border-gray-800 mx-2" 
		/>
		<Avatar 
			id="avatar-menu" 
			src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
			class="mx-2"
		 />
		<div class="mx-2">
			<div class="text-lg font-bold">
				Eugene Mpande
			</div>
			<div class="text-lg font-semibold">
				u21573558
			</div>
		</div>
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block text-sm">Eugene Mpande</span>
			<span class="block truncate text-sm font-medium">u21573558@tuks.co.za</span>
		</DropdownHeader>
		<DropdownItem href="/student/profile">Profile</DropdownItem>
		<DropdownDivider />
		<DropdownItem>Sign out</DropdownItem>
	</Dropdown>

</Navbar>
