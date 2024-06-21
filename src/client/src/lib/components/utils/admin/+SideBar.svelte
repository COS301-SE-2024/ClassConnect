<script lang="ts">
	import Logo from '$lib/images/class-connect-logo.png';
	import BullHorn from '$lib/images/bullhorn.svg';
	import Clipboard from '$lib/images/clipboard.svg';
	import Landmark from '$lib/images/landmark.svg';
	import Lecturers from '$lib/images/lecturer.svg';
	import Student from '$lib/images/students.svg';
	import Settings from '$lib/images/gear.svg';
	import Users from '$lib/images/users.svg';

	const nav_links = [
		{
			icon: BullHorn,
			name: 'Announcements',
			href: '/admin/announcements'
		},
		{
			icon: Clipboard,
			name: 'Activities',
			href: '/admin/activities'
		},
		{
			icon: Landmark,
			name: 'Organisation',
			href: '/admin/organisation'
		},
		{
			icon: Lecturers,
			name: 'Lecturers',
			href: '/admin/lecturers'
		},
		{
			icon: Student,
			name: 'Students',
			href: '/admin/students'
		},
		{
			icon: Student,
			name: 'Lessons',
			href: '/lessons'
		},
		{
			icon: Users,
			name: 'Admins',
			href: '/admin/admins'
		},
		{
			icon: Settings,
			name: 'Settings',
			href: '/admin/settings'
		}
	];
</script>

<aside
	class="flex h-screen w-64 flex-col overflow-y-auto border-r bg-primary-100 px-4 py-1 dark:border-gray-700 dark:bg-gray-900 rtl:border-l rtl:border-r-0"
>
	<a href="/" class="mx-auto">
		<div class="flex items-center">
			<img class="mr-2 h-20 w-auto" src={Logo} alt="Class Connect owl logo" />
			<div class="roboto text-xl dark:text-gray-300">Class Connect</div>
		</div>
	</a>

	<div class="mt-6 flex flex-1 flex-col justify-between">
		<nav>
			{#each nav_links as link}
				<a
					class="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-primary-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800"
					href={link.href}
				>
					<img class="h-5 w-5 dark:text-gray-300" src={link.icon} alt={link.name} />
					<span class="mx-4 font-medium">{link.name}</span>
				</a>
			{/each}
		</nav>
	</div>
</aside>
