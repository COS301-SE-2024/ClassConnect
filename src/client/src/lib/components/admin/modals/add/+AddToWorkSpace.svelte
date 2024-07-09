<script lang="ts">
	import { Button, Modal, Label } from 'flowbite-svelte';
	import { set_workspaces } from '$lib/services/workspaces';
	import axios from 'axios';
	import { wrkspcs } from '$lib/store';
	import { Checkbox } from 'flowbite-svelte';
	import { CirclePlusOutline } from 'flowbite-svelte-icons';
	export let id;

	let formModal = false;

	// Function to handle form submission
	async function handleSubmit(event) {
		console.log('add to workspace is being handled');
		// Prevent the default form submission behavior
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		formData.append('userId', id);

		// Collect all checked workspaces and append them to the form data
		let checkedWorkspaces = [];

		const checkboxes = event.currentTarget.querySelectorAll('input[name="workspace"]:checked');

		checkboxes.forEach((checkbox) => {
			checkedWorkspaces.push(checkbox.value);
		});

		formData.append('Workspaces', JSON.stringify(checkedWorkspaces));

		const response = await fetch('/admin/workspaces?/adduser', {
			method: 'POST',
			body: formData
		});

		console.log(response);

		formModal = false;
	}

	let workspaces = [];

	async function openModal() {
		await set_workspaces();

		const url = 'http://localhost:3000/users/' + id;

		const response = await axios.get(url);

		// Handle the response data
		const res_data = response.data;

		const wk_ids = [];

		for (let j = 0; j < res_data.workspaces.length; j++) {
			const wk_id = res_data.workspaces[j];
			wk_ids.push(wk_id);
		}

		for (let j = 0; j < $wrkspcs.length; j++) {
			const wk_id = $wrkspcs[j].id;
			if (wk_ids.includes(wk_id)) {
				workspaces.push({
					name: $wrkspcs[j].name,
					id: $wrkspcs[j].id,
					checked: true
				});
			} else {
				workspaces.push({
					name: $wrkspcs[j].name,
					id: $wrkspcs[j].id,
					checked: false
				});
			}
		}

		formModal = true;
	}
</script>

<button
	on:click={openModal}
	class="transition-colors duration-200 hover:text-green-500 focus:outline-none dark:text-gray-300 dark:hover:text-green-500"
>
	<CirclePlusOutline stroke={2} />
</button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add to Workspace</h3>

		<Label for="workspaces" class="mb-2 mt-2 space-y-2">Workspaces</Label>
		{#each workspaces as workspace}
			<Checkbox name="workspace" value={workspace.id} bind:checked={workspace.checked}
				>{workspace.name}</Checkbox
			>
		{/each}
		<Button type="submit" class="w-full1">Add to Workspace</Button>
	</form>
</Modal>
