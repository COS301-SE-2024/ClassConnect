<script lang="ts">
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode } from 'flowbite-svelte';
    import {
        BullhornSolid,
        BriefcaseSolid,
        UsersGroupSolid,
        ChartPieSolid,
        ArrowLeftOutline,
        ClipboardListSolid,
        GlobeSolid,
        BookOpenSolid,
        VideoCameraSolid
    } from 'flowbite-svelte-icons';
    import { page } from '$app/stores';
    import { writingQuiz } from '$lib/store/sidebar';
    import { onDestroy } from 'svelte';

    let isOpen = true;

    const unsubscribeWritingQuiz = writingQuiz.subscribe((value) => {
        isOpen = !value;
    });

    onDestroy(() => {
        unsubscribeWritingQuiz();
    });

    export let workspace;
    export let role: 'lecturer' | 'student';

    let workspaceURL = `/workspaces/${$page.params.workspace}`;

    const navLinks = {
        lecturer: [
            { name: 'Dashboard', href: workspaceURL + '/dashboard' },
            { name: 'Grade Center', href: workspaceURL + '/gradecenter' },
            { name: 'Announcements', href: workspaceURL + '/announcements' },
            { name: 'Materials', href: workspaceURL + '/materials' },
            { name: 'Lessons', href: workspaceURL + '/lessons' },
            { name: 'Quizzes', href: workspaceURL + '/quizzes' },
            { name: 'Environments', href: workspaceURL + '/environments' }
        ],
        student: [
            { name: 'Announcements', href: workspaceURL + '/announcements' },
            { name: 'Activities', href: workspaceURL + '/activities' },
            { name: 'Materials', href: workspaceURL + '/materials' },
            { name: 'Lessons', href: workspaceURL + '/lessons' },
            { name: 'Quizzes', href: workspaceURL + '/quizzes' },
            { name: 'Environments', href: workspaceURL + '/environments' },
            { name: 'Grades', href: workspaceURL + '/grades' }
        ]
    };

    $: role;
    $: workspace;
    $: currentLinks = navLinks[role];
    let activeUrl = '';
	const signout = () => {
        window.location.href = '/signout';
    };
</script>

<Navbar class="fixed start-0 top-0 z-20 w-full border-b px-2 py-2 sm:px-4 desktop-navbar">
    <NavBrand href="/">
        <img src={workspace.image} class="mr-3 h-8 sm:h-10" alt="ClassConnect owl logo" />
        <span
            class="self-center whitespace-nowrap text-xl font-semibold text-gray-800 transition-colors duration-300 dark:text-white"
            >{workspace.name}</span
        >
    </NavBrand>
    <NavHamburger />
    <NavUl>
        {#each currentLinks as { icon, name, href }}
            <NavLi {href} active={activeUrl === href} class="relative flex items-center px-4 py-2 mt-2 font-semibold transition-colors duration-300 ease-in-out mobile-nav-link">
                <svelte:component this={icon} class="h-5 w-5" />
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
            padding-top: 0.1rem;
            padding-bottom: 0.1rem;
        }
    }

    @media (max-width: 768px) {
        :global(.mobile-nav-link) {
            padding-left: 1.5rem !important;
        }
    }
</style>



<!--
<script lang="ts">
	import {
		BullhornSolid,
		BriefcaseSolid,
		UsersGroupSolid,
		ChartPieSolid,
		ArrowLeftOutline,
		ClipboardListSolid,
		GlobeSolid,
		BookOpenSolid,
		VideoCameraSolid
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { writingQuiz } from '$lib/store/sidebar';
	import { onDestroy } from 'svelte';

	let isOpen = true;

	const unsubscribeWritingQuiz = writingQuiz.subscribe((value) => {
		isOpen = !value;
	});

	onDestroy(() => {
		unsubscribeWritingQuiz();
	});

	export let workspace;
	export let role: 'lecturer' | 'student';

	let workspaceURL = `/workspaces/${$page.params.workspace}`;

	const navLinks = {
		lecturer: [
			{ icon: BullhornSolid, name: 'Dashboard', href: workspaceURL + '/dashboard' },
			{ icon: ClipboardListSolid, name: 'Grade Center', href: workspaceURL + '/gradecenter' },
			{ icon: BullhornSolid, name: 'Announcements', href: workspaceURL + '/announcements' },
			{ icon: BriefcaseSolid, name: 'Materials', href: workspaceURL + '/materials' },
			{ icon: VideoCameraSolid, name: 'Lessons', href: workspaceURL + '/lessons' },
			{ icon: BookOpenSolid, name: 'Quizzes', href: workspaceURL + '/quizzes' },
			{ icon: UsersGroupSolid, name: 'Environments', href: workspaceURL + '/environments' }
		],
		student: [
			{ icon: GlobeSolid, name: 'Announcements', href: workspaceURL + '/announcements' },
			{ icon: BullhornSolid, name: 'Activities', href: workspaceURL + '/activities' },
			{ icon: BriefcaseSolid, name: 'Materials', href: workspaceURL + '/materials' },
			{ icon: VideoCameraSolid, name: 'Lessons', href: workspaceURL + '/lessons' },
			{ icon: BookOpenSolid, name: 'Quizzes', href: workspaceURL + '/quizzes' },
			{ icon: UsersGroupSolid, name: 'Environments', href: workspaceURL + '/environments' },
			{ icon: ChartPieSolid, name: 'Grades', href: workspaceURL + '/grades' }
		]
	};

	$: role;
	$: workspace;
	$: currentLinks = navLinks[role];
</script>

<aside
	class="flex h-screen w-64 flex-col overflow-y-auto border-r bg-primary-100 px-4 py-6 dark:border-gray-700 dark:bg-gray-900 rtl:border-l rtl:border-r-0"
	class:hidden={!isOpen}
>
	<a
		href="/workspaces"
		class="mb-6 flex items-center text-gray-600 transition-colors duration-300 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
		data-sveltekit-reload
	>
		<ArrowLeftOutline class="h-5 w-5" />
		<span class="ml-2 text-base font-medium">Back to Workspaces</span>
	</a>

	<a href="/" class="mx-auto mb-6">
		<div class="items-center">
			<div class="flex justify-center">
				<img class="h-20 w-20 rounded-full" src={workspace.image} alt="ClassConnect owl logo" />
			</div>
			<div class="mt-2 text-center text-2xl font-semibold text-gray-800 dark:text-gray-300">
				{workspace.name}
			</div>
		</div>
	</a>

	<div class="flex flex-1 flex-col justify-between">
		<nav class="space-y-2">
			{#each currentLinks as { icon, name, href }}
				<a
					class="flex items-center rounded-lg px-4 py-2 text-gray-600 transition duration-300 hover:bg-primary-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800 {href ===
					$page.url.pathname
						? 'active-sidebar dark:text-gray-800'
						: ''}"
					{href}
				>
					<svelte:component this={icon} class="h-5 w-5" />
					<span class="ml-4 text-base font-medium">{name}</span>
				</a>
			{/each}
		</nav>
	</div>
</aside>

-->