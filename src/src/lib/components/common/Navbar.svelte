<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Skeleton, TextPlaceholder } from 'flowbite-svelte';

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
  
  <div class="relative px-8">
	<Navbar class="px-2 sm:px-4 md:py-0.5 fixed w-full z-20 top-0 start-0 border-b">
	  <NavBrand href="/">
		<img src="images/class-connect-logo.png" class="mr-3 h-8 sm:h-10" alt="ClassConnect Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
	  </NavBrand>
	  <NavHamburger />
	  <NavUl>
		{#each [...currentLinks, ...commonLinks] as { name, href }}
            <NavLi
                {href}
                active={activeUrl === href}
                class="nav-link"
            >
                {name}
            </NavLi>
        {/each}
        <NavLi on:click={signout}>
            <button
                class="w-full transform rounded-lg bg-red-600 px-3.5 py-2 text-left font-semibold text-white transition duration-300 ease-in-out hover:bg-red-700 hover:shadow-xl dark:bg-red-700 dark:hover:bg-red-800"
            >
                Sign Out
            </button>
        </NavLi>
    </NavUl>
	</Navbar>
  </div>

  <style>
	:global(.nav-link) {
		padding-top: 0.5rem;
	}
	@media (max-width: 768px) {
		:global(.nav-link) {
			padding-left: 1.5rem !important;
			font-weight: bold;
		}
	}
  </style>