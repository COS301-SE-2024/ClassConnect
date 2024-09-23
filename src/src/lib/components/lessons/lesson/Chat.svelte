<script lang="ts">
	import { Button, Avatar, Input } from 'flowbite-svelte';
	import { format } from 'date-fns';
  
	export let messages: string | any[] = [];
	let newMessage = '';
  
	function sendMessage() {
	  if (newMessage.trim()) {
		messages = [...messages, {
		  id: messages.length + 1,
		  sender: 'You',
		  avatar: '/path/to/your-avatar.jpg',
		  text: newMessage,
		  timestamp: new Date()
		}];
		newMessage = '';
	  }
	}
  
	function handleKeydown(event: { key: string; shiftKey: any; preventDefault: () => void; }) {
	  if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault();
		sendMessage();
	  }
	}
  </script>
  
  <div class="flex flex-col h-full">
	<div class="flex-grow overflow-y-auto p-4 space-y-4">
	  {#each messages as message (message.id)}
		<div class="flex items-start {message.sender === 'You' ? 'justify-end' : 'justify-start'}">
		  <div class="flex flex-col {message.sender === 'You' ? 'items-end' : 'items-start'} max-w-[70%]">
			<div class="flex items-center mb-1">
			  {#if message.sender !== 'You'}
				<Avatar src={message.avatar} alt={message.sender} class="mr-2" size="xs"/>
			  {/if}
			  <span class="text-sm font-semibold">{message.sender}</span>
			  {#if message.sender === 'You'}
				<Avatar src={message.avatar} alt={message.sender} class="ml-2" size="xs"/>
			  {/if}
			</div>
			<div class="bg-gray-100 rounded-lg p-3">
			  <p class="text-sm">{message.text}</p>
			</div>
			<span class="text-xs text-gray-500 mt-1">
			  {format(message.timestamp, 'HH:mm')}
			</span>
		  </div>
		</div>
	  {/each}
	</div>
	<div class="p-4 border-t">
	  <form on:submit|preventDefault={sendMessage} class="flex">
		<Input
		  class="flex-grow mr-2"
		  placeholder="Type a message..."
		  bind:value={newMessage}
		  on:keydown={handleKeydown}
		/>
		<Button type="submit">Send</Button>
	  </form>
	</div>
  </div>