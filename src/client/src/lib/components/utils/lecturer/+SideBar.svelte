<script lang="ts">
	import Logo from '$lib/images/class-connect-logo.png';
	import IconWorld from '@tabler/icons-svelte/IconWorld.svelte';
	import IconSpeakerphone from '@tabler/icons-svelte/IconSpeakerphone.svelte';
	import IconSandbox from '@tabler/icons-svelte/IconSandbox.svelte';
	import IconSchool from '@tabler/icons-svelte/IconSchool.svelte';
	import IconDashboard from '@tabler/icons-svelte/IconDashboard.svelte';

	const nav_links = [
		{
			icon: IconSpeakerphone,
			name: 'Announcements',
			href: '/lecturer'
		},
		{
			icon: IconWorld,
			name: 'Activities',
			href: '/lecturer/activities'
		},
		{
			icon: IconDashboard,
			name: 'Dashboard',
			href: '/lecturer/dashboard'
		},
		{
			icon: IconSchool,
			name: 'Classroom',
			href: '/lecturer/classroom'
		},
		{
			icon: IconSandbox,
			name: 'Sandbox',
			href: '/lecturer/sandbox'
		}
	];
</script>

<aside
	class="flex h-screen w-64 flex-col overflow-y-auto border-r bg-primary-100 px-4 py-1 dark:border-gray-700 dark:bg-gray-900 rtl:border-l rtl:border-r-0"
>
	<a href="/" class="mx-auto">
		<div class="flex items-center">
			<img class="mr-2 h-20 w-20" src={Logo} alt="Class Connect owl logo" />
			<div class="roboto text-xl dark:text-gray-300">Class Connect</div>
		</div>
	</a>

	<div
		class="mt-5
     flex flex-1 flex-col justify-between"
	>
		<nav>
			{#each nav_links as { icon, name, href }}
				<a
					class="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-primary-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800"
					{href}
				>
					<svelte:component this={icon} />
					<span class="mx-4 font-medium">{name}</span>
				</a>
			{/each}
		</nav>
	</div>
</aside>
