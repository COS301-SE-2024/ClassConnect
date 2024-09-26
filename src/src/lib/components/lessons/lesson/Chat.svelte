<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { Button, Input, Avatar } from 'flowbite-svelte';
	import type { Channel, FormatMessageResponse } from 'stream-chat';
	import AttendanceList from './AttendanceList.svelte';

	export let channel: Channel;

	let state: any;
	let newMessage = '';
	let activeTab = 'Chat'; // "Chat" by default
	let chatContainer: HTMLElement;
	let messages: FormatMessageResponse[] = []; // Initialize to avoid undefined

	onMount(async () => {
		state = await channel.watch();

		channel.on('message.new', (event: any) => {
			messages = [...messages, event.message];
		});

		messages = state.messages;
	});

	afterUpdate(() => {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});

	async function sendMessage() {
		if (newMessage.trim()) {
			await channel.sendMessage({ text: newMessage });
			newMessage = '';
		}
	}
</script>

{#if !state}
	<div class="flex h-full items-center justify-center">
		<p class="text-lg font-semibold text-gray-800 dark:text-gray-200">Connecting...</p>
	</div>
{:else}
	<div class="flex h-full flex-col">
		<!-- Tabs for Chat and Participants -->
		<div class="mb-4 flex space-x-4">
			<Button
				color={activeTab === 'Chat' ? 'primary' : 'light'}
				on:click={() => (activeTab = 'Chat')}
				class="flex-1"
			>
				Chat
			</Button>

			<Button
				color={activeTab === 'Participants' ? 'primary' : 'light'}
				on:click={() => (activeTab = 'Participants')}
				class="flex-1"
			>
				Participants
			</Button>
		</div>

		<!-- Chat View -->
		{#if activeTab === 'Chat'}
			<div class="flex-1 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
				<div
					bind:this={chatContainer}
					class="h-full overflow-y-auto p-4"
					style="width: 100%; transition: height 0.3s;"
				>
					{#each messages as message (message.id)}
						<div class="mb-6 last:mb-0">
							<div class="flex items-start">
								<Avatar src={message.user?.image} alt={message.user?.name} class="mr-2" />

								<div
									class="flex-grow rounded-bl-lg rounded-br-lg rounded-tr-lg bg-gray-200 p-3 dark:bg-gray-700"
								>
									<div class="mb-2 flex items-center">
										<p class="text-sm font-semibold text-gray-900 dark:text-white">
											{message.user?.name}
										</p>

										<span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
											{new Date(message.created_at).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</span>
									</div>
									<p class="text-sm text-gray-800 dark:text-gray-200">{message.text}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="mt-4">
				<form on:submit|preventDefault={sendMessage} class="flex space-x-2">
					<Input bind:value={newMessage} placeholder="Type a message..." class="flex-1" />
					<Button type="submit">Send</Button>
				</form>
			</div>
		{:else}
			<AttendanceList />
		{/if}
	</div>
{/if}
