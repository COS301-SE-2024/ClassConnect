<script lang="ts">
	import { page } from '$app/stores';
	import Logo from '$lib/images/class-connect-logo.png';
	import {
		GridOutline,
		FireOutline,
		GlobeOutline,
		BullhornSolid,
		BuildingSolid,
		ClipboardSolid,
		DesktopPcOutline,
		BriefcaseOutline,
		UserCircleOutline,
		InfoCircleOutline,
		UsersGroupOutline,
		ProfileCardOutline,
		ArrowLeftToBracketOutline,
		AdjustmentsHorizontalSolid
	} from 'flowbite-svelte-icons';

	export let role: 'lecturer' | 'admin' | 'student';

	const navLinks = {
		admin: [
			{ icon: GridOutline, name: 'Dashboard', href: '/dashboard' },
			{ icon: ClipboardSolid, name: 'Activities', href: '/activities' },
			{ icon: BullhornSolid, name: 'Announcements', href: '/announcements' },
			{ icon: BuildingSolid, name: 'Organisation', href: '/organisation' },
			{ icon: BriefcaseOutline, name: 'Workspaces', href: '/workspaces' },
			{ icon: UserCircleOutline, name: 'Admins', href: '/admins' },
			{ icon: ProfileCardOutline, name: 'Lecturers', href: '/lecturers' },
			{ icon: UsersGroupOutline, name: 'Students', href: '/students' }
		],
		lecturer: [
			{ icon: BullhornSolid, name: 'Workspaces', href: '/workspaces' },
			{ icon: GlobeOutline, name: 'Activities', href: '/activities' },
			{ icon: GridOutline, name: 'Dashboard', href: '/dashboard' },
			{ icon: DesktopPcOutline, name: 'Lesson', href: '/lessons' },
			{ icon: FireOutline, name: 'Sandbox', href: '/sandbox' }
		],
		student: [
			{ icon: GridOutline, name: 'Dashboard', href: '/student' },
			{ icon: DesktopPcOutline, name: 'Classroom', href: '/student/classroom' },
			{ icon: GlobeOutline, name: 'Activities', href: '/student/activities' }
		]
	};

	const commonLinks = [
		{ icon: AdjustmentsHorizontalSolid, name: 'Settings', href: '/settings' },
		{ icon: InfoCircleOutline, name: 'FAQ', href: '/student/faq' }
	];

	$: currentLinks = navLinks[role];
</script>

<aside
	class="bg-primary-100 flex h-screen w-64 flex-col overflow-y-auto border-r px-4 py-1 rtl:border-l rtl:border-r-0 dark:border-gray-700 dark:bg-gray-900"
>
	<a href="/" class="mx-auto">
		<div class="flex items-center">
			<img class="mr-2 h-20 w-20" src={Logo} alt="Class Connect owl logo" />
			<div class="roboto text-xl dark:text-gray-300">Class Connect</div>
		</div>
	</a>

	<div class="mt-5 flex flex-1 flex-col justify-between">
		<nav>
			{#each currentLinks as { icon, name, href }}
				<a
					class="hover:bg-primary-300 mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800 {href ===
					$page.url.pathname
						? 'active'
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
					class="hover:bg-primary-300 mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800 {href ===
					$page.url.pathname
						? 'active'
						: ''}"
					{href}
				>
					<svelte:component this={icon} />
					<span class="mx-4 font-medium">{name}</span>
				</a>
			{/each}
		</nav>

		<a
			class="hover:bg-primary-300 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800"
			href="/signout"
		>
			<svelte:component this={ArrowLeftToBracketOutline} />
			<span class="mx-4 font-medium">Sign Out</span>
		</a>
	</div>
</aside>
