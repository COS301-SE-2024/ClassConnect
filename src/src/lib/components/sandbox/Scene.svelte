<script lang="ts">
	import { setContext } from 'svelte';
	import ModelViewer from '$lib/components/sandbox/ModelViewer.svelte';
	import StarterScene from '$lib/components/sandbox/StarterScene.svelte';

	export let models;

	let currentModel: string;

	function loadModel(modelUrl: string) {
		currentModel = modelUrl;
	}

	setContext('models', models);
	setContext('loadModel', loadModel);
</script>

{#if !currentModel}
	<StarterScene />
{:else}
	<ModelViewer {currentModel} />
{/if}
