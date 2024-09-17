<!--
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
		AdjustmentsHorizontalSolid,
		ObjectsColumnSolid
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let role: 'lecturer' | 'admin' | 'student';

	let isMobile: boolean;
	let isOpen: boolean = false;

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
			isOpen = !isMobile;
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

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

	function toggleSidebar() {
		isOpen = !isOpen;
	}
</script>

<div class="relative">
	<button
		on:click={toggleSidebar}
		class="fixed left-4 top-4 z-50 rounded-lg bg-green-500 p-2 text-white shadow-lg md:hidden"
	>
		<ObjectsColumnSolid class="h-6 w-6" />
	</button>

	<aside
		class="glassmorphic fixed left-0 top-0 z-40 h-[calc(100vh-2rem)] m-4 w-64 transform overflow-y-auto bg-white/60 px-4 py-6 shadow-xl transition-all duration-300 ease-in-out dark:bg-gray-900/60 rounded-xl {isOpen ? 'translate-x-0' : '-translate-x-full'}"
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
				<a class={getClasses(href)} {href} on:click={() => (isMobile ? (isOpen = false) : null)}>
					<svelte:component this={icon} class="mr-3 h-5 w-5" />
					<span class="text-sm">{name}</span>
				</a>
			{/each}

			<hr class="my-6 border-gray-200 dark:border-gray-700" />

			{#each commonLinks as { icon, name, href }}
				<a class={getClasses(href)} {href} on:click={() => (isMobile ? (isOpen = false) : null)}>
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

<style>
	.glassmorphic {
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	aside {
		transition: transform 0.3s ease, backdrop-filter 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	aside::before {
		content: "";
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
		transform: rotate(30deg);
		pointer-events: none;
	}
</style>
-->
