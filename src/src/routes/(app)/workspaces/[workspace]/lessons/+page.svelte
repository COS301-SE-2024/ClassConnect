<script lang="ts">
  import { Button, Tabs, TabItem } from 'flowbite-svelte';

  import { formatDate } from '$utils/date';
  import CombinedLessons from '$src/lib/components/lessons/CombinedLessons.svelte';
  import Recordings from '$src/lib/components/lessons/lesson/Recordings.svelte';
  import ScheduleModal from '$src/lib/components/modals/lessons/Schedule.svelte';

  export let data: any;

  let isScheduleModalOpen = false;

  let lessons: any[] = [];

  $: ({ role, lessons, recordings } = data);

  $: {
    const now = new Date();

    lessons = lessons.map((lesson: any) => ({
      ...lesson,
      date: formatDate(new Date(lesson.date)),
      unformattedDate: new Date(lesson.date),
      isInSession: new Date(lesson.unformattedDate) <= now
    }));
  }
</script>

<Tabs tabStyle="pill">
  <TabItem title="Lessons" open>
    <main class="container mx-auto my-2 px-4 ">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <div class="flex items-center gap-x-3">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">Lessons</h2>
            <span
              class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
            >
              {lessons.length} lessons
            </span>
          </div>
        </div>
        {#if role === 'lecturer'}
          <Button size="sm" on:click={() => (isScheduleModalOpen = true)}>Schedule Lesson</Button>
        {/if}
      </div>
      <br />

      {#if lessons.length === 0}
        <p class="text-l text-gray-800 dark:text-white">
          There are no lessons scheduled at the moment.
        </p>
      {:else}
        <CombinedLessons {lessons} {role} />
      {/if}
    </main>
  </TabItem>
  <TabItem title="Recordings">
    <main class="container mx-auto my-2 px-4">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <div class="flex items-center gap-x-3">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">Recordings</h2>
            <span
              class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
            >
              {recordings.length} recordings
            </span>
          </div>
        </div>
      </div>
      <br />

      {#if recordings.length === 0}
        <p class="text-l text-gray-800 dark:text-white">
          There are no recordings of the lessons at the moment.
        </p>
      {:else}
        <Recordings {role} lessons={recordings} />
      {/if}
    </main>
  </TabItem>
</Tabs>

<ScheduleModal bind:open={isScheduleModalOpen} />

