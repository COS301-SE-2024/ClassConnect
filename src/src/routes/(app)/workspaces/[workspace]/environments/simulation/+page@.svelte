<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import Scene_2 from '$lib/components/sandbox/c_environment/Scene_2.svelte';
</script>

<div class="h-screen w-screen">
	<Canvas>
		<World>
			<Scene_2 />
		</World>
	</Canvas>
</div>
