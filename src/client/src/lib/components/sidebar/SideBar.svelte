<script lang="ts">
  import { page } from '$app/stores';
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  import { HomeSolid, NewspaperOutline, LandmarkSolid, UserCircleOutline, BookOpenOutline, ArrowLeftToBracketOutline} from 'flowbite-svelte-icons'; // Assuming these icons exist or you can replace with appropriate icons
  import EpiUseLabsLogoSmall from '$lib/images/EPI-USE_logo_(small).png'

  $: activeUrl = $page.url.pathname;
</script>

<style>
</style>

<div class="flex h-screen">
  <div class="w-64 bg-white shadow-md fixed h-screen">
    <div class="p-4">
      <img src={EpiUseLabsLogoSmall} alt="EPI-USE Labs Logo" class="w-36 mx-auto" />
    </div>
    <div class="flex items-center justify-center h-20">
      <div class="text-green-700 text-3xl font-bold">ClassConnect</div>
    </div>
    <Sidebar {activeUrl}>
      <SidebarWrapper>
        <SidebarGroup class="mb-24">
          <div class="text-xl font-bold px-4">Dashboard</div>
          <SidebarItem label="Home">
            <svelte:fragment slot="icon">
              <HomeSolid class="w-6 h-6 text-neutral-950  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            </svelte:fragment>
          </SidebarItem>
          <SidebarItem label="Activities">
            <svelte:fragment slot="icon">
              <NewspaperOutline class="w-6 h-6 text-neutral-950 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            </svelte:fragment>
          </SidebarItem>
        </SidebarGroup>
        <SidebarGroup class="mb-36">
          <div class="text-xl font-bold px-4">Manage</div>
          <SidebarItem label="Organisations">
            <svelte:fragment slot="icon">
              <LandmarkSolid class="w-6 h-6 text-neutral-950  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            </svelte:fragment>
          </SidebarItem>
          <SidebarItem label="Environment">
            <svelte:fragment slot="icon">
              <UserCircleOutline class="w-6 h-6 text-neutral-950  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            </svelte:fragment>
          </SidebarItem>
          <SidebarItem label="Workspaces">
            <svelte:fragment slot="icon">
              <BookOpenOutline class="w-6 h-6 text-neutral-950  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            </svelte:fragment>
          </SidebarItem>
        </SidebarGroup>
    <div class="mb-4">
      <SidebarGroup>
        <SidebarItem label="Sign Out">
          <svelte:fragment slot="icon">
            <ArrowLeftToBracketOutline class="w-6 h-6 text-neutral-950  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>
      </SidebarGroup>
    </div>
      </SidebarWrapper>
    </Sidebar>
  </div>

</div>
