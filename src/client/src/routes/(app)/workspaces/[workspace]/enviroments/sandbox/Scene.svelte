<script lang="ts">
	import { setContext } from 'svelte';

	import ModelViewer from './ModelViewer.svelte';
	import StarterScene from './StarterScene.svelte';

	let currentModel: string;

	const models = [
		{ name: 'Violin', url: '/models/violin.glb' },
		{ name: 'Golden Eagle', url: '/models/golden_eagle-v1.glb' },
		{ name: 'Cash Register', url: '/models/cash_register_with_a_counting_machine.glb' }
	];

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
