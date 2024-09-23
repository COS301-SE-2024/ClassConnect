<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import { hasScreenShare } from '@stream-io/video-client';

    import type { Writable } from 'svelte/store';
    import type { Call, StreamVideoParticipant } from '@stream-io/video-client';

    import Participant from './Participant.svelte';
    import ScreenShare from './ScreenShare.svelte';
    import Environment from './Environment.svelte';
	import { TabItem, Tabs } from 'flowbite-svelte';

    export let role: string;
    export let materials: any;

    let gridClass = '';
    let isEnvironmentOn = false;
    let participants: StreamVideoParticipant[] = [];
    let screenSharingParticipant: StreamVideoParticipant | null = null;

    let showMenu = false; // Controls the hamburger menu visibility
    const callStore = getContext<Writable<Call | null>>('call');

    $: {
        $callStore?.state.custom$.subscribe(({ environment }) => {
            isEnvironmentOn = environment;
        });
    }

    $: {
        $callStore?.state.participants$.subscribe((newParticipants) => {
            participants = newParticipants;
            screenSharingParticipant = newParticipants.find(hasScreenShare) || null;
            updateGridClass(participants.length);
        });
    }

    function updateGridClass(count: number) {
        if (count <= 1) gridClass = 'grid-cols-1';
        else if (count <= 4) gridClass = 'grid-cols-2';
        else if (count <= 9) gridClass = 'grid-cols-3';
        else gridClass = 'grid-cols-4';
    }

    function toggleMenu() {
        showMenu = !showMenu;
    }

    onMount(() => {
        updateGridClass(participants.length);
    });
</script>

<div class="h-screen flex flex-col">
    <Tabs style="full" class="bg-white shadow-md">
        <TabItem open title="Participants" on:click={() => isEnvironmentOn = false}>
            <span slot="title" class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Participants
            </span>
        </TabItem>
        <TabItem title="Screen Share" on:click={() => isEnvironmentOn = false}>
            <span slot="title" class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Screen Share
            </span>
        </TabItem>
        <TabItem title="3D Environment" on:click={() => isEnvironmentOn = true}>
            <span slot="title" class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                3D Environment
            </span>
        </TabItem>
    </Tabs>

    <div class="flex-grow overflow-hidden">
        {#if isEnvironmentOn}
            <Environment {materials} {role} />
        {:else if screenSharingParticipant}
            <ScreenShare participant={screenSharingParticipant} />
        {:else}
            <div class={`grid ${gridClass} h-full w-full gap-4 dark:bg-gray-900`}>
                {#each participants as participant (participant.sessionId)}
                    <Participant {participant} />
                {/each}
            </div>
        {/if}
    </div>
</div>
