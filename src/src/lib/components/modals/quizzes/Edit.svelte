<script lang="ts">
	import { Modal, Button, Select, Label } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let open = false;
	let selectedType = '';

	const questionTypes = [
		{ value: 'multiple-choice', name: 'Multiple Choice' },
		{ value: '3d-hotspot', name: '3D Hot Spot' }
	];

	function confirmSelection() {
		if (selectedType) {
			dispatch('select', { type: selectedType });
			open = false;
		}
	}
</script>

<Modal {open} on:close={() => (open = false)}>
	<h3 class="text-lg font-medium text-gray-900 dark:text-white">Choose Question Type</h3>
	<div class="mt-4">
		<Label>
			Select Question Type
			<Select class="mt-2" items={questionTypes} bind:value={selectedType} />
		</Label>
		<div class="mt-4 flex justify-end">
			<Button on:click={confirmSelection} disabled={!selectedType}>Add</Button>
		</div>
	</div>
</Modal>
