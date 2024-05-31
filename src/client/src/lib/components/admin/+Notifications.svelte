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

<h1 class="roboto p-2">Notifications</h1>

{#each activities as activity}
<div class="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 mt-2 mb-2">
    <div class="w-2 bg-gray-800 dark:bg-gray-900"></div>

    <div class="flex items-center px-2 py-3">
        <img class="object-cover w-10 h-10 rounded-full" alt="User avatar" src="https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=200">

        <div class="mx-3">
            <p class="text-gray-600 dark:text-gray-200">Student requested workspace access</p>
        </div>
    </div>
</div>
{/each}
