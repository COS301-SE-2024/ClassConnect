<script lang="ts">
	import Sandbox from '$src/lib/components/common/Sandbox.svelte';
	import { fullscreenlog } from '$src/lib/store/objects';
    import { items } from './items';
	let key = Date.now.toString();

	function handleFullscreenlogChange() {
		console.log('Fullscreen log changed:', $fullscreenlog);
		key = $fullscreenlog;
	}

	$: {
		fullscreenlog.subscribe(()=>{
			handleFullscreenlogChange();		
		})
	} 
</script>

<main>
	<Sandbox items={items} key={key} />
</main>