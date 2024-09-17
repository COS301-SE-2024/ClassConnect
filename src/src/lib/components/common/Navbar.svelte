<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let screenWidth: number;
	onMount(() => {
		screenWidth = window.innerWidth;
	});

	export let role: 'lecturer' | 'admin' | 'student';
	export let activeUrl = '';

	const navLinks = {
		admin: [
			{ name: 'Dashboard', href: '/dashboard' },
			{ name: 'Announcements', href: '/announcements' },
			{ name: 'Organisation', href: '/organisation' },
			{ name: 'Workspaces', href: '/workspaces' },
			{ name: 'Admins', href: '/admins' },
			{ name: 'Lecturers', href: '/lecturers' },
			{ name: 'Students', href: '/students' }
		],
		lecturer: [
			{ name: 'Workspaces', href: '/workspaces' },
			{ name: 'Announcements', href: '/announcements' }
		],
		student: [
			{ name: 'Dashboard', href: '/dashboard' },
			{ name: 'Workspaces', href: '/workspaces' },
			{ name: 'Announcements', href: '/announcements' },
			{ name: 'Grades', href: '/grades' }
		]
	};

	const commonLinks = [
		{ name: 'Settings', href: '/settings' },
		{ name: 'FAQ', href: '/faq' }
	];

	const currentLinks = navLinks[role];

	const signout = () => {
		window.location.href = '/signout';
	};
</script>

<Navbar
	class="desktop-navbar fixed start-0 top-0 z-20 m-4 w-[calc(100%-2rem)] rounded-xl border-white border-opacity-20 bg-white bg-opacity-20 p-3 shadow-xl backdrop-blur-lg transition-colors duration-300 dark:border-gray-700 dark:border-opacity-50 dark:bg-gray-800 dark:bg-opacity-30 sm:px-6"
>
	<NavBrand href="/">
		<img src="images/class-connect-logo.png" class="mr-3 h-8 sm:h-10" alt="ClassConnect Logo" />
		<span
			class="self-center whitespace-nowrap text-xl font-semibold text-white transition-colors duration-300 dark:text-gray-100"
		>
			ClassConnect
		</span>
	</NavBrand>
	{#if screenWidth <= 915}
		<NavHamburger />
	{/if}

	<NavUl>
		{#each currentLinks as { name, href }}
			<NavLi
				{href}
				active={activeUrl === href}
				class="mobile-nav-link group relative mt-2 flex items-center px-4 py-2 font-semibold text-white transition-colors duration-300 hover:text-white dark:text-gray-100 dark:hover:text-gray-100"
			>
				<span class="nav-link">{name}</span>
				<!-- Updated hover underline effect -->
				<span
					class="absolute -bottom-1 left-1/2 h-0.5 w-0 bg-white transition-all group-hover:w-3/6 dark:bg-gray-100"
				></span>
				<span
					class="absolute -bottom-1 right-1/2 h-0.5 w-0 bg-white transition-all group-hover:w-3/6 dark:bg-gray-100"
				></span>
			</NavLi>
		{/each}
		{#each commonLinks as { name, href }}
			<NavLi
				{href}
				active={activeUrl === href}
				class="mobile-nav-link group relative mt-2 flex items-center px-4 py-2 font-semibold text-white transition-colors duration-300 hover:text-white dark:text-gray-100 dark:hover:text-gray-100"
			>
				<span class="nav-link">{name}</span>
				<!-- Updated hover underline effect -->
				<span
					class="absolute -bottom-1 left-1/2 h-0.5 w-0 bg-white transition-all group-hover:w-3/6 dark:bg-gray-100"
				></span>
				<span
					class="absolute -bottom-1 right-1/2 h-0.5 w-0 bg-white transition-all group-hover:w-3/6 dark:bg-gray-100"
				></span>
			</NavLi>
		{/each}
		<NavLi on:click={signout}>
			<button
				class="w-full transform rounded-lg bg-red-600 px-4 py-2 text-left font-semibold text-white transition duration-300 ease-in-out hover:bg-red-700 hover:shadow-xl dark:bg-red-700 dark:hover:bg-red-800"
			>
				Sign Out
			</button>
		</NavLi>
	</NavUl>
</Navbar>

<style>
	.nav-link {
		position: relative;
	}

	@media (min-width: 1024px) {
		:global(.desktop-navbar) {
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
		}
	}

	@media (max-width: 768px) {
		:global(.mobile-nav-link) {
			padding-left: 1.5rem !important;
		}
	}
</style>
