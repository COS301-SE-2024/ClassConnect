<script lang="ts">
	import { vid_url } from '$lib/store';
	import { onMount } from 'svelte';

	const videoLink = $vid_url;
	let videoElement: HTMLVideoElement;

	onMount(() => {
		if (videoElement) {
			videoElement.addEventListener('error', (e) => {
				console.error('Error loading video:', e);
			});
		}
	});

	function getVideoType(url: string): string {
		const extension = url.split('.').pop()?.toLowerCase();
		switch (extension) {
			case 'mp4':
				return 'video/mp4';
			case 'webm':
				return 'video/webm';
			case 'ogg':
				return 'video/ogg';
			default:
				return 'video/mp4';
		}
	}
</script>

<video
	bind:this={videoElement}
	class="h-auto w-full max-w-full rounded-lg border border-gray-200 dark:border-gray-700"
	width="320"
	height="240"
	autoplay
	controls
>
	<source src={videoLink} type={getVideoType(videoLink)} />
	<source src={videoLink} type="video/webm" />
	<source src={videoLink} type="video/mp4" />
	<source src={videoLink} type="video/ogg" />
	<track kind="captions" />
	Your browser does not support the video tag.
</video>
