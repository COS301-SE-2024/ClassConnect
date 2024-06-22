<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
    import { Checkbox } from 'flowbite-svelte';
    import IconLibraryPlus from '@tabler/icons-svelte/IconLibraryPlus.svelte';
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
        
        checkboxes.forEach(checkbox => {
            checkedWorkspaces.push(checkbox.value);
        });

        formData.append('Workspaces', JSON.stringify(checkedWorkspaces));

        console.log(formData);

		const response = await fetch('/admin/workspaces?/adduser', {
			method: 'POST',
			body: formData
		});

		console.log(response);

		formModal = false;

	}

    let workspaces = [];

    function openModal(){
        formModal = true;
        //TODO: fetch the all the workspaces in the organization
        const organisationId = localStorage.getItem('organisationID') || 'non-existent';
        const userId = localStorage.getItem('userID') || 'non-existent';

        console.log(organisationId);
        console.log(userId);

        /**
         * after that use the workspace id returned to get the name of the 
         * workspaces
        */

        /**
         * after you have all the workspace in a
         * organisation use the userId to make a get all workspaces a user is a 
         * part of and make sure the are checked
        */

        workspaces = [
            {
                name: "Computer Networks",
                id: "1",
                checked: false
            },
            {
                name: "Computer Graphics",
                id: "2",
                checked: false
            }
        ]

    }

</script>

<button
	on:click={openModal}
	class="transition-colors duration-200 hover:text-green-500 focus:outline-none dark:text-gray-300 dark:hover:text-green-500"
>
	<IconLibraryPlus stroke={2} />
</button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add to Workspace</h3>

		<Label for="workspaces" class="mb-2 mt-2 space-y-2">Workspaces </Label>
        {#each workspaces as workspace}
            <Checkbox name="workspace" value={workspace.id} bind:checked={workspace.checked}>{workspace.name}</Checkbox>
        {/each}
		<Button type="submit" class="w-full1">Add to Workspace</Button>
	</form>
</Modal>
  