<script>
	import {
		Navbar,
		Breadcrumb,
		BreadcrumbItem,
		NavLi,
		DarkMode,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider
	} from 'flowbite-svelte';
</script>

<Navbar>
	<Breadcrumb aria-label="Default breadcrumb example">
		<BreadcrumbItem href="/student" home>Home</BreadcrumbItem>
	</Breadcrumb>
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
			<span class="block text-sm">Bonnie Green</span>
			<span class="block truncate text-sm font-medium">name@flowbite.com</span>
		</DropdownHeader>
		<DropdownItem>Dashboard</DropdownItem>
		<DropdownItem>Settings</DropdownItem>
		<DropdownItem>Earnings</DropdownItem>
		<DropdownDivider />
		<DropdownItem>Sign out</DropdownItem>
	</Dropdown>

</Navbar>
