<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Input, Avatar, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import type { Channel, FormatMessageResponse } from 'stream-chat';

	export let channel: Channel;

	let state: any;
	let newMessage = '';
	let messages: FormatMessageResponse[];

	onMount(async () => {
		state = await channel.watch();

		channel.on('message.new', (event: any) => {
			messages = [...messages, event.message];
		});

		messages = state.messages;
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
		<Listgroup class="flex-1 space-y-4 overflow-y-auto p-4">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>

			{#each messages as message (message.id)}
				<ListgroupItem class="align-center flex items-start items-center justify-start">
					<Avatar src={message.user?.image} alt={message.user?.name} />

					<div class="ml-2 w-full rounded-lg bg-green-100 p-3 lg:max-w-md">
						<p class="text-sm font-semibold">{message.user?.name}</p>
						<p>{message.text}</p>
					</div>

					<hr />
				</ListgroupItem>
			{/each}
		</Listgroup>

		<div class="border-t p-4">
			<form on:submit|preventDefault={sendMessage} class="flex space-x-2">
				<Input bind:value={newMessage} placeholder="Type a message..." class="flex-1" />
				<Button type="submit">Send</Button>
			</form>
		</div>
	</div>
{/if}
