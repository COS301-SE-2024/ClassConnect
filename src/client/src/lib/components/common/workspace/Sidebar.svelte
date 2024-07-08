<script lang="ts">
	import {
		BullhornSolid,
		BriefcaseOutline,
		UserCircleOutline,
		UsersGroupOutline,
		ChartLineUpOutline,
		ArrowLeftOutline
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';

	export let workspace;
	export let role: 'lecturer' | 'student';

	let workspaceURL = `/workspaces/${$page.params.workspace}`;

	const navLinks = {
		lecturer: [
			{ icon: BullhornSolid, name: 'Dashboard', href: workspaceURL + '/dashboard' },
			{ icon: BullhornSolid, name: 'Announcements', href: workspaceURL + '/announcements' },
			{ icon: BriefcaseOutline, name: 'Materials', href: workspaceURL + '/materials' },
			{ icon: UserCircleOutline, name: 'Lessons', href: workspaceURL + '/lessons' },
			{ icon: UsersGroupOutline, name: 'Sandbox', href: workspaceURL + '/sandbox' }
		],
		student: [
			{ icon: BullhornSolid, name: 'Announcements', href: workspaceURL + '/announcements' },
			{ icon: BriefcaseOutline, name: 'Materials', href: workspaceURL + '/materials' },
			{ icon: UserCircleOutline, name: 'Lessons', href: workspaceURL + '/lessons' },
			{ icon: UsersGroupOutline, name: 'Sandbox', href: workspaceURL + '/sandbox' },
			{ icon: ChartLineUpOutline, name: 'Grades', href: workspaceURL + '/grades' }
		]
	};

	$: role;
	$: workspace;
	$: currentLinks = navLinks[role];
</script>

<aside
	class="bg-primary-100 flex h-screen w-64 flex-col overflow-y-auto border-r px-4 py-1 rtl:border-l rtl:border-r-0 dark:border-gray-700 dark:bg-gray-900"
>
	<!-- Back button -->
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
			<div class="roboto text-center text-xl dark:text-gray-300">{workspace.name}</div>
		</div>
	</a>

	<div class="mt-5 flex flex-1 flex-col justify-between">
		<nav>
			{#each currentLinks as { icon, name, href }}
				<a
					class="hover:bg-primary-300 mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800 {href ===
					$page.url.pathname
						? 'active dark:text-gray-800'
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
