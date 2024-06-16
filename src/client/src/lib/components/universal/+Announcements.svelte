<script lang="ts">
	import AnnouncementCard from '$lib/components/utils/universal/cards/+AnnCard.svelte';
	export let announcements;
</script>

<div class="bg-lightBgColor dark:bg-gray-800">
	<div class="text-center">
		<h1 class="text-4xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
			Announcements
		</h1>
	</div>
	{#each announcements as announcement}
		<AnnouncementCard date={announcement.date} heading={announcement.heading} announcement={announcement.announcement}/>
	{/each}
</div>
