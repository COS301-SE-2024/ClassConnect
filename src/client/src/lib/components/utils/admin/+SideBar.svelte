<script lang="ts">
	import { page } from '$app/stores';
	import { user } from '$lib/store';
	import Logo from '$lib/images/class-connect-logo.png';
	import {
		BullhornSolid,
		ClipboardSolid,
		BuildingSolid,
		ProfileCardOutline,
		UserCircleOutline,
		UsersGroupOutline,
		HomeOutline,
		BriefcaseOutline,
		AdjustmentsHorizontalSolid
	} from 'flowbite-svelte-icons';

	console.log($user);

	const nav_links = [
		{
			icon: HomeOutline,
			name: 'Home',
			href: '/admin'
		},
		{
			icon: BullhornSolid,
			name: 'Announcements',
			href: '/admin/announcements'
		},
		{
			icon: ClipboardSolid,
			name: 'Activities',
			href: '/admin/activities'
		},
		{
			icon: BuildingSolid,
			name: 'Organisation',
			href: '/admin/organisation?orgID=' + $user.getOrganisation()
		},
		{
			icon: ProfileCardOutline,
			name: 'Lecturers',
			href: '/admin/lecturers?orgID=' + $user.getOrganisation()
		},
		{
			icon: UsersGroupOutline,
			name: 'Students',
			href: '/admin/students?orgID=' + $user.getOrganisation()
		},
		{
			icon: BriefcaseOutline,
			name: 'Workspaces',
			href: '/admin/workspaces?orgID=' + $user.getOrganisation()
		},
		{
			icon: UserCircleOutline,
			name: 'Admins',
			href: '/admin/admins?orgID=' + $user.getOrganisation()
		},
		{
			icon: AdjustmentsHorizontalSolid,
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
