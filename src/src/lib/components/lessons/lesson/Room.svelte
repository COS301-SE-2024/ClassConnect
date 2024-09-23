<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Button, Card, Input } from 'flowbite-svelte';
	import Layout from './Layout.svelte';
	import Controls from './Controls.svelte';
	import AttendanceList from './AttendanceList.svelte';

	let isConnected = false;
	let participants: {
		id: number;
		name: string;
		role: string;
		avatar: string;
		isSpeaking: boolean;
	}[] = [];
	let chatMessages: any[] = [];
	let newMessage = '';

	onMount(async () => {
		// Simulating connection process
		await new Promise((resolve) => setTimeout(resolve, 2000));
		isConnected = true;
		participants = [
			{
				id: 1,
				name: 'John Doe',
				role: 'Lecturer',
				avatar: 'path/to/avatar1.jpg',
				isSpeaking: true
			},
			{
				id: 2,
				name: 'Jane Smith',
				role: 'Student',
				avatar: 'path/to/avatar2.jpg',
				isSpeaking: false
			}
			// Add more participants as needed
		];
	});

	onDestroy(() => {
		// Clean up logic here (e.g., leaving the call, stopping chat channel)
	});

	function sendMessage() {
		if (newMessage.trim()) {
			chatMessages = [...chatMessages, { sender: 'You', text: newMessage }];
			newMessage = '';
		}
	}
</script>

{#if isConnected}
	<div class="flex h-screen flex-col">
		<div class="flex flex-grow">
			<div class="w-3/4 bg-gray-100">
				<Layout />
			</div>
			<div class="flex w-1/4 flex-col bg-white p-4">
				<Card class="mb-4 flex-grow overflow-y-auto">
					<h3 class="mb-2 text-lg font-semibold">Chat</h3>
					{#each chatMessages as message}
						<div class="mb-2">
							<span class="font-bold">{message.sender}:</span>
							{message.text}
						</div>
					{/each}
				</Card>
				<div class="flex">
					<Input class="mr-2 flex-grow" placeholder="Type a message..." bind:value={newMessage} />
					<Button on:click={sendMessage}>Send</Button>
				</div>
			</div>
		</div>
		<Controls />
	</div>
	<AttendanceList {participants} />
{:else}
	<div class="flex h-screen items-center justify-center">
		<Card>
			<h2 class="mb-4 text-2xl font-bold">Connecting to the room...</h2>
			<p>Please wait while we establish the connection.</p>
		</Card>
	</div>
{/if}
