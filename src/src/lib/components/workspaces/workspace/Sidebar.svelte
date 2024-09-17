<script lang="ts">
    import {
      Navbar,
      NavBrand,
      NavLi,
      NavUl,
      NavHamburger,
      Dropdown,
      DropdownItem,
      DropdownDivider
    } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
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
      lecturer: {
        dashboard: [
          { name: 'Dashboard', href: workspaceURL + '/dashboard' }
        ],
        management: [
          { name: 'Grade Center', href: workspaceURL + '/gradecenter' },
          { name: 'Announcements', href: workspaceURL + '/announcements' },
          { name: 'Materials', href: workspaceURL + '/materials' },
          { name: 'Lessons', href: workspaceURL + '/lessons' },
          { name: 'Quizzes', href: workspaceURL + '/quizzes' }
        ],
        resources: [
          { name: 'Environments', href: workspaceURL + '/environments' }
        ]
      },
      student: {
        courseWork: [
          { name: 'Announcements', href: workspaceURL + '/announcements' },
          { name: 'Activities', href: workspaceURL + '/activities' },
          { name: 'Materials', href: workspaceURL + '/materials' },
          { name: 'Lessons', href: workspaceURL + '/lessons' },
          { name: 'Quizzes', href: workspaceURL + '/quizzes' }
        ],
        additional: [
          { name: 'Environments', href: workspaceURL + '/environments' },
          { name: 'Grades', href: workspaceURL + '/grades' }
        ]
      }
    };
  
    $: role;
    $: workspace;
    $: currentLinks = navLinks[role];
    
    let activeUrl = '';
    const signout = () => {
      window.location.href = '/signout';
    };

    const backToMain = () => {
        window.location.href = '/';
    };

    let isHovered = false;
  </script>
  
  <Navbar class="fixed start-0 top-0 z-20 m-4 w-[calc(100%-2rem)] rounded-xl border-white border-opacity-20 bg-white bg-opacity-20 p-2 shadow-xl backdrop-blur-lg transition-colors duration-300 dark:border-gray-700 dark:border-opacity-50 dark:bg-gray-800 dark:bg-opacity-30 sm:px-6">
    <NavBrand>
      <img src={workspace.image} class="mr-3 h-8 sm:h-10" alt="ClassConnect owl logo" />
      <span
        class="self-center whitespace-nowrap text-xl font-semibold text-gray-800 transition-colors duration-300 dark:text-white"
        >{workspace.name}</span
      >
    </NavBrand>
    <NavHamburger />
    <NavUl>
      {#if role === 'lecturer'}
        {#if currentLinks.dashboard.length > 1}
          <NavLi class="cursor-pointer nav-link">
            Dashboard<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
          </NavLi>
          <Dropdown class="w-44 z-20">
            {#each currentLinks.dashboard as { name, href }}
              <DropdownItem href={href}>{name}</DropdownItem>
            {/each}
          </Dropdown>
        {:else}
          <NavLi class="nav-link" href={currentLinks.dashboard[0].href} active={activeUrl === currentLinks.dashboard[0].href}>
            {currentLinks.dashboard[0].name}
          </NavLi>
        {/if}
  
        {#if currentLinks.management.length > 1}
          <NavLi class="cursor-pointer nav-link">
            Management<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
          </NavLi>
          <Dropdown class="w-44 z-20">
            {#each currentLinks.management as { name, href }}
              <DropdownItem href={href}>{name}</DropdownItem>
            {/each}
          </Dropdown>
        {:else}
          <NavLi class="nav-link" href={currentLinks.management[0].href} active={activeUrl === currentLinks.management[0].href}>
            {currentLinks.management[0].name}
          </NavLi>
        {/if}
  
        {#if currentLinks.resources.length > 1}
          <NavLi class="cursor-pointer nav-link">
            Resources<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
          </NavLi>
          <Dropdown class="w-44 z-20">
            {#each currentLinks.resources as { name, href }}
              <DropdownItem href={href}>{name}</DropdownItem>
            {/each}
          </Dropdown>
        {:else}
          <NavLi class="nav-link" href={currentLinks.resources[0].href} active={activeUrl === currentLinks.resources[0].href}>
            {currentLinks.resources[0].name}
          </NavLi>
        {/if}
      {/if}
  
      {#if role === 'student'}
        {#if currentLinks.courseWork.length > 1}
          <NavLi class="cursor-pointer nav-link">
            Course Work<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
          </NavLi>
          <Dropdown class="w-44 z-20">
            {#each currentLinks.courseWork as { name, href }}
              <DropdownItem href={href}>{name}</DropdownItem>
            {/each}
          </Dropdown>
        {:else}
          <NavLi class="nav-link" href={currentLinks.courseWork[0].href} active={activeUrl === currentLinks.courseWork[0].href}>
            {currentLinks.courseWork[0].name}
          </NavLi>
        {/if}
  
        {#if currentLinks.additional.length > 1}
          <NavLi class="cursor-pointer nav-link">
            Additional<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
          </NavLi>
          <Dropdown class="w-44 z-20">
            {#each currentLinks.additional as { name, href }}
              <DropdownItem href={href}>{name}</DropdownItem>
            {/each}
          </Dropdown>
        {:else}
          <NavLi class="nav-link" href={currentLinks.additional[0].href} active={activeUrl === currentLinks.additional[0].href}>
            {currentLinks.additional[0].name}
          </NavLi>
        {/if}
      {/if}
      <NavLi on:click={backToMain}>
        <button
          class="w-full transform rounded-lg bg-blue-600 px-4 py-2 text-left font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-700 hover:shadow-xl dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Leave {workspace.name}
        </button>
      </NavLi>
      <NavLi on:click={signout}>
        <button
          class="w-full transform rounded-lg bg-red-600 px-4 py-2 text-left font-semibold text-white transition duration-300 ease-in-out hover:bg-red-700 hover:shadow-xl dark:bg-red-700 dark:hover:bg-red-800"
        >
          Signout
        </button>
      </NavLi>
    </NavUl>
  </Navbar>

  <style>
    :global(.nav-link) {
      padding-top: 0.5rem; /* Adjust this value as needed */
    }
    
    @media (max-width: 768px) {
      :global(.nav-link) {
        padding-left: 1.5rem !important;
      }
    }
  </style>
