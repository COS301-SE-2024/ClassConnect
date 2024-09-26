<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';
	import Chat from './Chat.svelte';
	import Participant from './Participant.svelte';

	let activeTab = 'chat';
	let messages: never[] = [];
	let participants: any[] = [];

	// Populate participants and messages as needed
</script>

<div class="flex h-full flex-col">
	<Tabs style="pills" class="border-b bg-white p-2">
		<TabItem open title="Chat" on:click={() => (activeTab = 'chat')}>
			<span slot="title" class="flex items-center gap-2">
				<svg
					class="h-5 w-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
					></path>
				</svg>
				Chat
			</span>
		</TabItem>
		<TabItem title="Participants" on:click={() => (activeTab = 'participants')}>
			<span slot="title" class="flex items-center gap-2">
				<svg
					class="h-5 w-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
					></path>
				</svg>
				Participants
			</span>
		</TabItem>
	</Tabs>

	<div class="flex-grow overflow-hidden">
		{#if activeTab === 'chat'}
			<Chat {messages} />
		{:else if activeTab === 'participants'}
			<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{#each participants as participant}
					<Participant {...participant} />
				{/each}
			</div>
		{/if}
	</div>
</div>
