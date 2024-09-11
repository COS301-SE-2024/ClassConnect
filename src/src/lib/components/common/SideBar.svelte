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

	function getClasses(href: string) {
		const baseClasses =
			'flex items-center rounded-lg px-4 py-3 text-gray-600 transition-all duration-300 hover:bg-green-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-green-900 dark:hover:text-green-100';
		const activeClasses =
			'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 font-medium';
		return href === $page.url.pathname ? `${baseClasses} ${activeClasses}` : baseClasses;
	}
</script>

<div class="flex min-h-screen flex-col">
	<aside
		class="m-4 flex w-64 flex-1 flex-col overflow-y-auto rounded-xl bg-white px-4 py-6 shadow-xl transition-all duration-300 dark:bg-gray-900"
	>
		<a href="/" class="mx-auto mb-8">
			<div class="flex items-center">
				<img
					class="mr-3 h-10 w-10"
					src="images/class-connect-logo.png"
					alt="ClassConnect owl logo"
				/>
				<div class="text-xl font-bold text-green-700 dark:text-green-300">ClassConnect</div>
			</div>
		</a>

		<nav class="flex-1 space-y-1">
			{#each currentLinks as { icon, name, href }}
				<a class={getClasses(href)} {href}>
					<svelte:component this={icon} class="mr-3 h-5 w-5" />
					<span class="text-sm">{name}</span>
				</a>
			{/each}

			<hr class="my-6 border-gray-200 dark:border-gray-700" />

			{#each commonLinks as { icon, name, href }}
				<a class={getClasses(href)} {href}>
					<svelte:component this={icon} class="mr-3 h-5 w-5" />
					<span class="text-sm">{name}</span>
				</a>
			{/each}
		</nav>

		<a
			class="mt-6 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-red-700 dark:text-gray-300 dark:hover:bg-red-900 dark:hover:text-red-100"
			href="/signout"
		>
			<svelte:component this={ArrowLeftToBracketOutline} class="mr-3 h-5 w-5" />
			<span class="text-sm font-medium">Sign Out</span>
		</a>
	</aside>
</div>
