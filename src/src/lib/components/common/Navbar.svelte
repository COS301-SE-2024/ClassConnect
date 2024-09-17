<script lang="ts">
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode } from 'flowbite-svelte';
	import {onMount} from 'svelte';
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

<Navbar class="fixed start-0 top-0 z-20 m-4 w-[calc(100%-2rem)] rounded-xl border-b bg-white/70 px-4 py-2 backdrop-blur-md dark:bg-gray-800/70 sm:px-6 desktop-navbar">
    <NavBrand href="/">
        <img src="images/class-connect-logo.png" class="mr-3 h-8 sm:h-10" alt="ClassConnect Logo" />
        <span
            class="self-center whitespace-nowrap text-xl font-semibold text-gray-800 transition-colors duration-300 dark:text-white"
            >ClassConnect</span
        >
    </NavBrand>
	{#if screenWidth <= 915}
		<NavHamburger />
  	{/if}
    
    <NavUl>
        {#each currentLinks as { name, href }}
            <NavLi {href} active={activeUrl === href} class="relative flex items-center px-4 py-2 mt-2 font-semibold text-gray-700 transition-colors duration-300 ease-in-out hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400 mobile-nav-link">
                <span class="nav-link">{name}</span>
            </NavLi>
        {/each}
        {#each commonLinks as { name, href }}
            <NavLi {href} active={activeUrl === href} class="relative flex items-center px-4 py-2 mt-2 font-semibold text-gray-700 transition-colors duration-300 ease-in-out hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400 mobile-nav-link">
                <span class="nav-link">{name}</span>
            </NavLi>
        {/each}
        <NavLi on:click={signout}>
            <button class="w-full text-left transform rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-red-700 hover:shadow-xl dark:bg-red-700 dark:hover:bg-red-800">
                Signout
            </button>
        </NavLi>
    </NavUl>
</Navbar>

<style>

    .nav-link {
        position: relative;
    }

    .nav-link::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: -4px;
        left: 0;
        background-color: currentColor;
        transform: scaleX(0);
        transform-origin: bottom right;
        transition: transform 0.3s ease-out;
    }

    .nav-link:hover::after {
        transform: scaleX(1);
        transform-origin: bottom left;
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