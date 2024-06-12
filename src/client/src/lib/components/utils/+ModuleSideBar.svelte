<script lang="ts">
	import Logo from '$lib/images/class-connect-logo.png';
	import IconHome from '@tabler/icons-svelte/IconHome.svelte';
	import IconChartHistogram from '@tabler/icons-svelte/IconChartHistogram.svelte';
	import IconWorld from '@tabler/icons-svelte/IconWorld.svelte';
    import IconSpeakerphone from '@tabler/icons-svelte/IconSpeakerphone.svelte';
    import IconBook from '@tabler/icons-svelte/IconBook.svelte';
    import IconSandbox from '@tabler/icons-svelte/IconSandbox.svelte';
    import IconSchool from '@tabler/icons-svelte/IconSchool.svelte';

	const user = {
		name: 'Eugene',
		email: 'eugene.mpande@tuks.co.za',
		avatar:
			'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
	};

	const nav_links = [
		{
			icon: IconSpeakerphone,
			name: 'Announcements',
			href: '/student/module'
		},
		{
			icon: IconBook,
			name: 'Study Materials',
			href: '/student/study'
		},
		{
			icon: IconSandbox,
			name: 'SandBox',
			href: '/student/sandbox'
		},
		{
			icon: IconSchool,
			name: 'Classroom',
			href: '/student/classroom'
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