<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '../../lib/components/envirmonment/+Scene.svelte';
	import ObjectSettings from '$lib/components/envirmonment/models/+ObjectSettings.svelte';

	let autoRotate: boolean = false
  	let enableDamping: boolean = true
  	let rotateSpeed: number = 1
  	let zoomToCursor: boolean = false
  	let zoomSpeed: number = 1
  	let enableZoom: boolean = true

</script>

<main>
	<section class="canvas-wrapper h-[700px] ring">
		<Canvas>
			<Scene  {enableDamping}
			{autoRotate}
			{rotateSpeed}
			{zoomToCursor}
			{zoomSpeed}
			{enableZoom} />
		</Canvas>
	</section>
	<ObjectSettings
  bind:enableDamping
  bind:autoRotate
  bind:rotateSpeed
  bind:zoomToCursor
  bind:zoomSpeed
  bind:enableZoom
/>
</main>
