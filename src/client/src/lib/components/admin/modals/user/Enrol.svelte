<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	export let id: string;
	export let role: string;
	export let open: boolean;
	export let workspaces: any;

	let error: string;

	function close() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				open = false;
			} else {
				error = result.data?.error;
			}
		};
	}

    // Static list of available workspaces with images
    

    let selectedWorkspaces = [];
</script>

<Modal bind:open size="xs" class="w-full">
	<form method="POST" action="?/enrol" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Enrol {role}</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" id="id" name="id" value={id} size="md" readonly />

        <fieldset>
            <legend class="mb-2 mt-2 text-left">Select Workspaces</legend>
            {#each workspaces as workspace}
                <label class="flex items-center space-x-2 mb-2">
                    <input type="checkbox" name="workspaces" value={workspace.id} bind:group={selectedWorkspaces} />
                    <img src={workspace.image} alt={workspace.name} class="w-8 h-8 rounded-full" />
                    <span>{workspace.name}</span>
                </label>
            {/each}
        </fieldset>

		<Button type="submit" class="mt-4 w-full">Enrol</Button>
	</form>
</Modal>
