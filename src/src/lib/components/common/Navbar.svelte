<script lang="ts">
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
  
    export let role: 'lecturer' | 'admin' | 'student';
    export let activeUrl = '';

    const navLinks = {
		admin: [
			{ name: 'Dashboard', href: '/dashboard' },
			{ name: 'Announcements', href: '/announcements' },
			{ name: 'Organisation', href: '/organisation' },
			{ name: 'Workspaces', href: '/workspaces' },
			{ name: 'Admins', href: '/admins' },
			{ name: 'Lecturers', href: '/lecturers' },
			{ name: 'Students', href: '/students' }
		],
		lecturer: [
			{ name: 'Workspaces', href: '/workspaces' },
			{ name: 'Announcements', href: '/announcements' }
		],
		student: [
			{ name: 'Dashboard', href: '/dashboard' },
			{ name: 'Workspaces', href: '/workspaces' },
			{ name: 'Announcements', href: '/announcements' },
			{ name: 'Grades', href: '/grades' }
		]
	};

    const commonLinks = [
		{ name: 'Settings', href: '/settings' },
		{ name: 'FAQ', href: '/faq' }
	];

    const currentLinks = navLinks[role];
  </script>
  
  <div class="relative px-4 sm:px-6 lg:px-8">
    <Navbar class="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 start-0 border-b">
      <NavBrand href="/">
        <img src="images/class-connect-logo.png" class="h-8 sm:h-10 mr-3" alt="ClassConnect Logo" />
        <span class="self-center text-xl font-semibold whitespace-nowrap text-gray-800 dark:text-white transition-colors duration-300">ClassConnect</span>
      </NavBrand>
      <NavHamburger />
      <NavUl>
        {#each currentLinks as { name, href }}
            <NavLi href={href} active={activeUrl === href}>
                {name}
            </NavLi>
        {/each}
        {#each commonLinks as {name, href }}
            <NavLi href={href} active={activeUrl === href}>
                {name}
            </NavLi>
        {/each}
      </NavUl>
    </Navbar>
  </div>