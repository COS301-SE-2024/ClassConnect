<script lang="ts">
	import Card from '$src/lib/components/announcements/Card.svelte';

	export let announcements;
</script>

<main class="h-screen bg-lightBgColor dark:bg-gray-800">
	<div class="text-center">
		<h1 class="text-4xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
			Announcements
		</h1>
	</div>

	{#if announcements.length > 0}
		{#each announcements as announcement}
			<Card
				date={announcement.date}
				title={announcement.title}
				description={announcement.description}
			/>
		{/each}
	{:else}
		<p class="mt-4 text-center text-2xl text-gray-600 dark:text-gray-300">
			You do not have any announcements
		</p>
	{/if}
</main>
