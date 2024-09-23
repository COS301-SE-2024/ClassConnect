<script>
	import { Card, Avatar } from 'flowbite-svelte';
	import { Microphone, BoltSlash } from 'svelte-heros-v2';

	export let name = '';
	export let isMicOn = false;
	export let isCameraOn = false;
	export let videoStream = null;
	export let profilePicture = '';
</script>

<Card class="max-w-sm">
	<div class="flex flex-col items-center pb-10">
		{#if isCameraOn && videoStream}
			<video src={videoStream} class="mb-3 h-24 w-24 rounded-full shadow-lg" autoplay muted />
		{:else}
			<Avatar src={profilePicture} alt={name} class="mb-3 h-24 w-24 rounded-full shadow-lg" />
		{/if}
		<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
			{name}
		</h5>
		<div class="mt-4 flex space-x-3 md:mt-6">
			{#if isMicOn}
				<Microphone class="h-6 w-6 text-green-500" />
			{:else}
				<BoltSlash class="h-6 w-6 text-red-500" />
			{/if}
		</div>
	</div>
</Card>
