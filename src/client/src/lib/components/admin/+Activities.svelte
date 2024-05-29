<script lang="ts">
    import { Timeline, TimelineItem } from 'flowbite-svelte';
    import { CalendarWeekSolid } from 'flowbite-svelte-icons';
    
    const activities = [
        {
            title: 'Attend COS 301 meeting',
            date: 'May 13th, 2024',
        },
        {
            title: 'Attend COS 344 marking session',
            date: 'June 7th, 2024',
        },
        {
            title: 'Attend Graduation ceremony',
            date: 'December 2nd, 2024',
        }
    ]
</script>

<div>
    <h1 class="roboto p-2">Activities</h1>
      
    <Timeline order="vertical">
    {#each activities as activity}
    
    <TimelineItem title={activity.title} date={activity.title}>
        <svelte:fragment slot="icon">
        <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
            <CalendarWeekSolid class="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </span>
        </svelte:fragment>
    </TimelineItem>
    {/each}

    </Timeline>
    
</div>

