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
			{ icon: UsersGroupSolid, name: 'Environments', href: workspaceURL + '/environments' },
			{ icon: BookOpenSolid, name: 'Interactive', href: workspaceURL + '/interactive' }
		],
		student: [
			{ icon: GlobeSolid, name: 'Announcements', href: workspaceURL + '/announcements' },
			{ icon: BullhornSolid, name: 'Activities', href: workspaceURL + '/activities' },
			{ icon: BriefcaseSolid, name: 'Materials', href: workspaceURL + '/materials' },
			{ icon: VideoCameraSolid, name: 'Lessons', href: workspaceURL + '/lessons' },
			{ icon: BookOpenSolid, name: 'Quizzes', href: workspaceURL + '/quizzes' },
			{ icon: UsersGroupSolid, name: 'Environments', href: workspaceURL + '/environments' },
			{ icon: ChartPieSolid, name: 'Grades', href: workspaceURL + '/grades' },
			{ icon: BookOpenSolid, name: 'Interactive', href: workspaceURL + '/interactive' }
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
