<script lang="ts">
	import {
		GridSolid,
		BullhornSolid,
		BuildingSolid,
		BriefcaseSolid,
		InfoCircleSolid,
		ProfileCardSolid,
		UserCircleSolid,
		UsersGroupSolid,
		ChartLineUpOutline,
		ArrowLeftToBracketOutline,
		AdjustmentsHorizontalSolid
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';

	export let role: 'lecturer' | 'admin' | 'student';

	const navLinks = {
		admin: [
			{ icon: GridSolid, name: 'Dashboard', href: '/dashboard' },
			{ icon: BullhornSolid, name: 'Announcements', href: '/announcements' },
			{ icon: BuildingSolid, name: 'Organisation', href: '/organisation' },
			{ icon: BriefcaseSolid, name: 'Workspaces', href: '/workspaces' },
			{ icon: UserCircleSolid, name: 'Admins', href: '/admins' },
			{ icon: ProfileCardSolid, name: 'Lecturers', href: '/lecturers' },
			{ icon: UsersGroupSolid, name: 'Students', href: '/students' }
		],
		lecturer: [
			{ icon: BriefcaseSolid, name: 'Workspaces', href: '/workspaces' },
			{ icon: BullhornSolid, name: 'Announcements', href: '/announcements' }
		],
		student: [
			{ icon: GridSolid, name: 'Dashboard', href: '/dashboard' },
			{ icon: BriefcaseSolid, name: 'Workspaces', href: '/workspaces' },
			{ icon: BullhornSolid, name: 'Announcements', href: '/announcements' },

			{ icon: ChartLineUpOutline, name: 'Grades', href: '/grades' }
		]
	};

	const commonLinks = [
		{ icon: ProfileCardSolid, name: 'Profile', href: '/profile' },
		{ icon: AdjustmentsHorizontalSolid, name: 'Settings', href: '/settings' },
		{ icon: InfoCircleSolid, name: 'FAQ', href: '/faq' }
	];

	const currentLinks = navLinks[role];
</script>

<aside
	class="flex h-screen w-64 flex-col overflow-y-auto border-r bg-primary-100 px-4 py-1 dark:border-gray-700 dark:bg-gray-900 rtl:border-l rtl:border-r-0"
>
	<a href="/" class="mx-auto">
		<div class="flex items-center">
			<img
				class="mr-2 h-20 w-20"
				src="images/class-connect-logo.png"
				alt="Class Connect owl logo"
			/>
			<div class="text-xl dark:text-gray-300">ClassConnect</div>
		</div>
	</a>

	<div class="mt-5 flex flex-1 flex-col justify-between">
		<nav>
			{#each currentLinks as { icon, name, href }}
				<a
					class="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-primary-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800 {href ===
					$page.url.pathname
						? 'active-sidebar dark:text-gray-800'
						: ''}"
					{href}
				>
					<svelte:component this={icon} />
					<span class="mx-4 font-medium">{name}</span>
				</a>
			{/each}

			<br />
			<hr />

			{#each commonLinks as { icon, name, href }}
				<a
					class="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-primary-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800 {href ===
					$page.url.pathname
						? 'active-sidebar dark:text-gray-800'
						: ''}"
					{href}
				>
					<svelte:component this={icon} />
					<span class="mx-4 font-medium">{name}</span>
				</a>
			{/each}
		</nav>

		<a
			class="flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-primary-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800"
			href="/signout"
		>
			<svelte:component this={ArrowLeftToBracketOutline} />
			<span class="mx-4 font-medium">Sign Out</span>
		</a>
	</div>
</aside>
