<script lang="ts">
	import Logo from '$lib/images/class-connect-logo.png';
	import Home from '$lib/images/homeIcon.svg';
	import BullHorn from '$lib/images/bullhorn.svg';
	import Clipboard from '$lib/images/clipboard.svg';
	import Landmark from '$lib/images/landmark.svg';
	import Lecturers from '$lib/images/lecturer.svg';
	import Student from '$lib/images/students.svg';
	import Settings from '$lib/images/gear.svg';
	import Users from '$lib/images/users.svg';

	const user = {
		name: 'Eugene',
		email: 'eugene.mpande@tuks.co.za',
		avatar:
			'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
	};

	const nav_links = [
		{
			icon: Home,
			name: 'Home',
			href: '/'
		},
		{
			icon: BullHorn,
			name: 'Announcements',
			href: '/announcements'
		},
		{
			icon: Clipboard,
			name: 'Activities',
			href: '/activities'
		},
		{
			icon: Landmark,
			name: 'Organisation',
			href: '/organisation'
		},
		{
			icon: Lecturers,
			name: 'Lecturers',
			href: '/lecturers'
		},
		{
			icon: Student,
			name: 'Students',
			href: '/students'
		},
		{
			icon: Student,
			name: 'Lessons',
			href: '/lessons'
		},
		{
			icon: Users,
			name: 'Admins',
			href: '/admins'
		},
		{
			icon: Settings,
			name: 'Settings',
			href: '/settings'
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

	<div class="-mx-2 mt-2 flex flex-col items-center">
		<a href="/profile">
			<img class="mx-2 h-24 w-24 rounded-full object-cover" src={user.avatar} alt="avatar" />
		</a>
		<h4 class="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">{user.name}</h4>
		<p class="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">{user.email}</p>
	</div>

	<div class="mt-6 flex flex-1 flex-col justify-between">
		<nav>
			{#each nav_links as { icon, name, href }}
				<a
					class="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-primary-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-400 dark:hover:text-gray-800"
					{href}
				>
					<img class="h-5 w-5 dark:text-gray-300" src={icon} alt={name} />
					<span class="mx-4 font-medium">{name}</span>
				</a>
			{/each}
		</nav>
	</div>
</aside>
