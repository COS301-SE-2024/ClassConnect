<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import { GiftBoxSolid, ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
    const workspaces = [
        {
            name: 'COS 332 : Computer Networks',
            description: 'This workspace is for COS 332 students to collaborate and share resources.',
        },
        {
            name: 'COS 314 : Artificial Intelligence ',
            description: 'This workspace is for COS 314 students to collaborate and share resources.'
        },
        {
            name: 'COS 344 : Computer Graphics ',
            description: 'This workspace is for COS 344 students to collaborate and share resources.'
        },
        {
            name: 'COS 332 : Computer Networks',
            description: 'This workspace is for COS 332 students to collaborate and share resources.'
        },
        {
            name: 'COS 314 : Artificial Intelligence ',
            description: 'This workspace is for COS 314 students to collaborate and share resources.'
        },
        {
            name: 'COS 344 : Computer Graphics ',
            description: 'This workspace is for COS 344 students to collaborate and share resources.'
        },
        {
            name: 'COS 332 : Computer Networks',
            description: 'This workspace is for COS 332 students to collaborate and share resources.'
        },
        {
            name: 'COS 314 : Artificial Intelligence ',
            description: 'This workspace is for COS 314 students to collaborate and share resources.'
        },
        {
            name: 'COS 344 : Computer Graphics ',
            description: 'This workspace is for COS 344 students to collaborate and share resources.'
        },
        {
            name: 'COS 332 : Computer Networks',
            description: 'This workspace is for COS 332 students to collaborate and share resources.'
        },
        {
            name: 'COS 314 : Artificial Intelligence ',
            description: 'This workspace is for COS 314 students to collaborate and share resources.'
        },
        {
            name: 'COS 344 : Computer Graphics ',
            description: 'This workspace is for COS 344 students to collaborate and share resources.'
        },
    ]  
</script>

<div class="grid grid-cols-3 gap-3">
    {#each workspaces as workspace}
    <Card>
        <GiftBoxSolid class="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
        <a href="/">
            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{workspace.name}</h5>
        </a>
        <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">{workspace.description}</p>
        <a href="/" class="inline-flex items-center text-primary-600 hover:underline">
            Edit
            <ArrowUpRightFromSquareOutline class="w-4 h-4 ms-2.5" />
        </a>
    </Card>
    {/each}
</div>