<script lang="ts">
    import Lecturers from '$lib/components/admin/+Lectures.svelte';
    import Students from '$lib/components/admin/+Students.svelte';
    import Workspaces from '$lib/components/admin/+Workspaces.svelte';
    import { Tabs, TabItem } from 'flowbite-svelte';
</script>

<div class="w-full">
    <header>
        <div class="mx-auto max-w-screen-xl mb-1 roboto">
            <div class="sm:flex sm:items-center sm:justify-between">
            <div class="text-center sm:text-left">
                <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome Back, Barry!</h1>
        
            </div>
        
            </div>
        </div>
    </header>
    <Tabs>
      <TabItem open title="Overview">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          <b>Overview:</b>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </TabItem>
      <TabItem title="Lecturers">
        <Lecturers />
      </TabItem>
      <TabItem title="Students">
        <Students />
      </TabItem>
      <TabItem title="Workspaces">
        <Workspaces />
      </TabItem>
    </Tabs>
</div>
  