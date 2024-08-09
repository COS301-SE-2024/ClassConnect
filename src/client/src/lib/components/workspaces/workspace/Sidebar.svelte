<script lang="ts">
	//import { sidebarOpen } from '$lib/store/sidebar';
	import {
		BullhornSolid,
		BriefcaseSolid,
		UserCircleSolid,
		UsersGroupSolid,
		ChartPieSolid,
		ArrowLeftOutline,
		GlobeOutline
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
			{ icon: ChartPieSolid, name: 'Grades', href: workspaceURL + '/grades' },
			{ icon: ChartPieSolid, name: 'Student Marks', href: workspaceURL + '/studentmarks' },
			{ icon: BullhornSolid, name: 'Announcements', href: workspaceURL + '/announcements' },
			{ icon: BriefcaseSolid, name: 'Materials', href: workspaceURL + '/materials' },
			{ icon: UserCircleSolid, name: 'Lessons', href: workspaceURL + '/lessons' },
			{ icon: UserCircleSolid, name: 'Quizzes', href: workspaceURL + '/quizzes' },
			{ icon: UsersGroupSolid, name: 'Environments', href: workspaceURL + '/environments' }
		],
		student: [
			{ icon: GlobeOutline, name: 'Announcements', href: workspaceURL + '/announcements' },
			{ icon: BullhornSolid, name: 'Activities', href: workspaceURL + '/activities' },
			{ icon: BriefcaseSolid, name: 'Materials', href: workspaceURL + '/materials' },
			{ icon: UserCircleSolid, name: 'Lessons', href: workspaceURL + '/lessons' },
			{ icon: UserCircleSolid, name: 'Quizzes', href: workspaceURL + '/quizzes' },
			{ icon: UsersGroupSolid, name: 'Environments', href: workspaceURL + '/environments' },
			{ icon: ChartPieSolid, name: 'Grades', href: workspaceURL + '/grades' }
		]
	};

	$: role;
	$: workspace;
	$: currentLinks = navLinks[role];
</script>

<aside
	class="flex h-screen w-64 flex-col overflow-y-auto border-r bg-primary-100 px-4 py-1 dark:border-gray-700 dark:bg-gray-900 rtl:border-l rtl:border-r-0"
	class:hidden={!isOpen}
>
	<a
		href="/workspaces"
		class="mb-4 flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
	>
		<ArrowLeftOutline class="h-5 w-5" />
		<span class="ml-2">Back to Workspaces</span>
	</a>

	<a href="/" class="mx-auto">
		<div class="items-center">
			<div class="flex justify-center">
				<img class="mb-2 h-20 w-20" src={workspace.image} alt="Class Connect owl logo" />
			</div>
			<div class="text-center text-xl dark:text-gray-300">{workspace.name}</div>
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
		</nav>
	</div>
</aside>
