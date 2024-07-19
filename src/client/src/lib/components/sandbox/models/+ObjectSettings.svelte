<script lang="ts">
	import { Checkbox, Pane, ThemeUtils, Slider } from 'svelte-tweakpane-ui';
	import { fullscreenlog } from '$src/lib/store/objects';
	export let autoRotate: boolean;
	export let enableDamping: boolean;
	export let rotateSpeed: number;
	export let zoomToCursor: boolean;
	export let zoomSpeed: number;
	export let enableZoom: boolean;
	export let fullscreen: boolean;
	export let canvasElement: any;

	function handleFullScreen() {
        if (!document.fullscreenElement && fullscreen) {
			canvasElement.requestFullscreen().catch((err: any) => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
			if (document.exitFullscreen && !fullscreen && document.fullscreenElement) {
				document.exitFullscreen().then(() => {
					const log : string = 'Exited full-screen mode at : ' + Date.now().toString();
					fullscreenlog.set(log);
				}).catch((err) => {
					alert(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
				});
			}
        }
    }
</script>

<Pane theme={ThemeUtils.presets.light} title="Object Settings">
	<Checkbox bind:value={autoRotate} label="autoRotate" />
	<Checkbox bind:value={enableDamping} label="enableDamping" />
	<Checkbox bind:value={enableZoom} label="enableZoom" />
	<Checkbox bind:value={zoomToCursor} label="zoomToCursor" />
	<Checkbox bind:value={fullscreen} label="fullscreen" on:change={handleFullScreen} />
	<Slider label="rotateSpeed" bind:value={rotateSpeed} min={0.1} max={8} step={0.1} />
	<Slider label="zoomSpeed" bind:value={zoomSpeed} min={0.1} max={4} step={0.1} />
</Pane>
