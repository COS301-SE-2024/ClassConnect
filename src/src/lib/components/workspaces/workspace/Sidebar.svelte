<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem
	} from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	export let workspace: { name: string; image: string };
	export let role: 'lecturer' | 'student';

	let workspaceURL = `/workspaces/${$page.params.workspace}`;

	type NavLink = { name: string; href: string };

	interface LecturerLinks {
		dashboard: NavLink[];
		management: NavLink[];
		resources: NavLink[];
	}

	interface StudentLinks {
		courseWork: NavLink[];
		additional: NavLink[];
	}

	type NavLinks = {
		lecturer: LecturerLinks;
		student: StudentLinks;
	};

	const navLinks: NavLinks = {
		lecturer: {
			dashboard: [{ name: 'Dashboard', href: workspaceURL + '/dashboard' }],
			management: [
				{ name: 'Grade Center', href: workspaceURL + '/gradecenter' },
				{ name: 'Announcements', href: workspaceURL + '/announcements' },
				{ name: 'Materials', href: workspaceURL + '/materials' },
				{ name: 'Lessons', href: workspaceURL + '/lessons' },
				{ name: 'Quizzes', href: workspaceURL + '/quizzes' },
				{ name: 'Interactive Lessons', href: workspaceURL + '/interactive' },
			],
			resources: [{ name: 'Environments', href: workspaceURL + '/environments' }]
		},
		student: {
			courseWork: [
				{ name: 'Announcements', href: workspaceURL + '/announcements' },
				{ name: 'Activities', href: workspaceURL + '/activities' },
				{ name: 'Materials', href: workspaceURL + '/materials' },
				{ name: 'Lessons', href: workspaceURL + '/lessons' },
				{ name: 'Quizzes', href: workspaceURL + '/quizzes' },
				{ name: 'Interactive Lessons', href: workspaceURL + '/interactive' },
			],
			additional: [
				{ name: 'Environments', href: workspaceURL + '/environments' },
				{ name: 'Grades', href: workspaceURL + '/grades' }
			]
		}
	};

	$: currentLinks = navLinks[role];

	function isLecturerLinks(links: LecturerLinks | StudentLinks): links is LecturerLinks {
		return 'dashboard' in links;
	}

	function isStudentLinks(links: LecturerLinks | StudentLinks): links is StudentLinks {
		return 'courseWork' in links;
	}

	let activeUrl = '';

	const backToMain = () => {
		window.location.href = '/';
	};
</script>

<div>
	<Navbar class="fixed start-0 top-0 z-20 w-full border-b px-2 sm:px-4 md:py-0.5 lg:py-0.5">
		<NavBrand href="/">
			<img
				src="../../../../../../images/class-connect-logo.png"
				class="mr-3 h-8 sm:h-10"
				alt="ClassConnect Logo"
			/>
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>ClassConnect</span
			>
		</NavBrand>
		<NavHamburger />
		<NavUl>
			{#if isLecturerLinks(currentLinks)}
				{#if currentLinks.dashboard.length > 1}
					<NavLi class="nav-link cursor-pointer">
						Dashboard<ChevronDownOutline
							class="ms-2 inline h-6 w-6 text-primary-800 dark:text-white"
						/>
					</NavLi>
					<Dropdown class="z-20 w-44">
						{#each currentLinks.dashboard as { name, href }}
							<DropdownItem {href}>{name}</DropdownItem>
						{/each}
					</Dropdown>
				{:else}
					<NavLi
						class="nav-link"
						href={currentLinks.dashboard[0].href}
						active={activeUrl === currentLinks.dashboard[0].href}
					>
						{currentLinks.dashboard[0].name}
					</NavLi>
				{/if}

				{#if currentLinks.management.length > 1}
					<NavLi class="nav-link cursor-pointer">
						Management<ChevronDownOutline
							class="ms-2 inline h-6 w-6 text-primary-800 dark:text-white"
						/>
					</NavLi>
					<Dropdown class="z-20 w-44">
						{#each currentLinks.management as { name, href }}
							<DropdownItem {href}>{name}</DropdownItem>
						{/each}
					</Dropdown>
				{:else}
					<NavLi
						class="nav-link"
						href={currentLinks.management[0].href}
						active={activeUrl === currentLinks.management[0].href}
					>
						{currentLinks.management[0].name}
					</NavLi>
				{/if}

				{#if currentLinks.resources.length > 1}
					<NavLi class="nav-link cursor-pointer">
						Resources<ChevronDownOutline
							class="ms-2 inline h-6 w-6 text-primary-800 dark:text-white"
						/>
					</NavLi>
					<Dropdown class="z-20 w-44">
						{#each currentLinks.resources as { name, href }}
							<DropdownItem {href}>{name}</DropdownItem>
						{/each}
					</Dropdown>
				{:else}
					<NavLi
						class="nav-link"
						href={currentLinks.resources[0].href}
						active={activeUrl === currentLinks.resources[0].href}
					>
						{currentLinks.resources[0].name}
					</NavLi>
				{/if}
			{:else if isStudentLinks(currentLinks)}
				{#if currentLinks.courseWork.length > 1}
					<NavLi class="nav-link cursor-pointer">
						Course Work<ChevronDownOutline
							class="ms-2 inline h-6 w-6 text-primary-800 dark:text-white"
						/>
					</NavLi>
					<Dropdown class="z-20 w-44">
						{#each currentLinks.courseWork as { name, href }}
							<DropdownItem {href}>{name}</DropdownItem>
						{/each}
					</Dropdown>
				{:else}
					<NavLi
						class="nav-link"
						href={currentLinks.courseWork[0].href}
						active={activeUrl === currentLinks.courseWork[0].href}
					>
						{currentLinks.courseWork[0].name}
					</NavLi>
				{/if}

				{#if currentLinks.additional.length > 1}
					<NavLi class="nav-link cursor-pointer">
						Additional<ChevronDownOutline
							class="ms-2 inline h-6 w-6 text-primary-800 dark:text-white"
						/>
					</NavLi>
					<Dropdown class="z-20 w-44">
						{#each currentLinks.additional as { name, href }}
							<DropdownItem {href}>{name}</DropdownItem>
						{/each}
					</Dropdown>
				{:else}
					<NavLi
						class="nav-link"
						href={currentLinks.additional[0].href}
						active={activeUrl === currentLinks.additional[0].href}
					>
						{currentLinks.additional[0].name}
					</NavLi>
				{/if}
			{/if}
			<NavLi on:click={backToMain}>
				<button
					class="w-full transform rounded-lg bg-red-600 px-4 py-2 text-left font-semibold text-white transition duration-300 ease-in-out hover:bg-red-700 hover:shadow-xl dark:bg-red-700 dark:hover:bg-red-800"
				>
					Leave {workspace.name}
				</button>
			</NavLi>
		</NavUl>
	</Navbar>
</div>
