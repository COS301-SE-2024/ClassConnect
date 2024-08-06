<script lang="ts">
	const videoLink = 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4';
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
