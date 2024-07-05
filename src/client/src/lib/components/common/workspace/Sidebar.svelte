<script lang="ts">
	import {
		BullhornSolid,
		BriefcaseOutline,
		UserCircleOutline,
		UsersGroupOutline,
		ChartLineUpOutline
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

	$: currentLinks = navLinks[role];
</script>

<aside
	class="bg-primary-100 flex h-screen w-64 flex-col overflow-y-auto border-r px-4 py-1 rtl:border-l rtl:border-r-0 dark:border-gray-700 dark:bg-gray-900"
>
	<a href="/" class="mx-auto">
		<div class="items-center">
			<img class="h-20 w-20 mb-2" src={workspace.image} alt="Class Connect owl logo" />
			<div class="roboto text-center text-xl dark:text-gray-300">{workspace.name}</div>
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
		</nav>
	</div>
</aside>
