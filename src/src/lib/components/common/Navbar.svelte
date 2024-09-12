<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';

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
</script>

<Navbar class="fixed start-0 top-0 z-20 w-full border-b px-2 py-2.5 sm:px-4">
	<NavBrand href="/">
		<img src="images/class-connect-logo.png" class="mr-3 h-8 sm:h-10" alt="ClassConnect Logo" />
		<span
			class="self-center whitespace-nowrap text-xl font-semibold text-gray-800 transition-colors duration-300 dark:text-white"
			>ClassConnect</span
		>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		{#each currentLinks as { name, href }}
			<NavLi {href} active={activeUrl === href}>
				{name}
			</NavLi>
		{/each}
		{#each commonLinks as { name, href }}
			<NavLi {href} active={activeUrl === href}>
				{name}
			</NavLi>
		{/each}
	</NavUl>
</Navbar>
