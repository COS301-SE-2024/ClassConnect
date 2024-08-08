<script lang="ts">
	import { vid_url } from '$lib/store';
	const videoLink = $vid_url;
</script>

<video
	class="h-auto w-full max-w-full rounded-lg border border-gray-200 dark:border-gray-700"
	width="320"
	height="240"
	autoplay
	controls
>
	<source src={videoLink} type="video/mp4" />
	<track kind="captions" />
	Your browser does not support the video tag.
</video>
