<script lang="ts">
	import { page } from '$app/stores';
	import Logo from '$lib/images/class-connect-logo.png';
	/*import IconSpeakerphone from '@tabler/icons-svelte/IconSpeakerphone.svelte';
	import IconClipboard from '@tabler/icons-svelte/IconClipboard.svelte';
	import IconBuilding from '@tabler/icons-svelte/IconBuilding.svelte';
	import IconSchool from '@tabler/icons-svelte/IconSchool.svelte';
	import IconUserStar from '@tabler/icons-svelte/IconUserStar.svelte';
	import IconSettings from '@tabler/icons-svelte/IconSettings.svelte';
	import IconUsers from '@tabler/icons-svelte/IconUsers.svelte';
	import IconHome from '@tabler/icons-svelte/IconHome.svelte';
	import IconDesk from '@tabler/icons-svelte/IconDesk.svelte';*/

	const nav_links = [
		{
			//icon: IconHome,
			name: 'Home',
			href: '/admin'
		},
		{
			//icon: IconSpeakerphone,
			name: 'Announcements',
			href: '/admin/announcements'
		},
		{
			//icon: IconClipboard,
			name: 'Activities',
			href: '/admin/activities'
		},
		{
			//icon: IconBuilding,
			name: 'Organisation',
			href: '/admin/organisation'
		},
		{
			//icon: IconSchool,
			name: 'Lecturers',
			href: '/admin/lecturers'
		},
		{
			//icon: IconUsers,
			name: 'Students',
			href: '/admin/students'
		},
		{
			//icon: IconDesk,
			name: 'Workspaces',
			href: '/admin/workspaces'
		},
		{
			//icon: IconUserStar,
			name: 'Admins',
			href: '/admin/admins'
		},
		{
			//icon: IconSettings,
			name: 'Settings',
			href: '/admin/settings'
		}
	];
</script>

<aside
	class="flex h-screen w-64 flex-col overflow-y-auto border-r bg-primary-100 px-4 py-1 dark:border-gray-700 dark:bg-gray-900 rtl:border-l rtl:border-r-0"
>
	<a href="/" class="mx-auto">
		<div class="flex items-center">
			<img class="mr-2 h-20 w-auto" src={Logo} alt="Class Connect owl logo" />
			<div class="roboto text-xl dark:text-gray-300">Class Connect</div>
		</div>
	</a>

	<div class="mt-6 flex flex-1 flex-col justify-between">
		<nav>
			{#each nav_links as link}
				<a
					class="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-primary-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800 {link.href ===
					$page.url.pathname
						? 'active'
						: ''}"
					href={link.href}
				>
					<svelte:component this={link.icon} />
					<span class="mx-4 font-medium">{link.name}</span>
				</a>
			{/each}
		</nav>
	</div>
</aside>
