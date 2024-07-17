<script lang="ts">
  import { Card, Button, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, TableSearch } from 'flowbite-svelte';
  import { ArrowRightOutline, EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	
  export let data;
  $: ({ lecturers, workspaces } = data);
  let searchTerm = '';
  $: filteredWorkspaces = workspaces.filter((workspace: { name: string; }) => 
    workspace.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );

	import RemoveModal from '$lib/components/modals/Delete.svelte';
  import AddModal from '$lib/components/modals/workspace/Add.svelte';
  import EditModal from '$lib/components/modals/workspace/Edit.svelte';

	let id: string;
	let isAddModalOpen = false;
  let isEditModalOpen = false;
  let isRemoveModalOpen = false;

	function handleEditModalOpen(lecturerId: string) {
    id = lecturerId;
    isEditModalOpen = true;
  }

  function handleRemoveModalOpen(lecturerId: string) {
    id = lecturerId;
    isRemoveModalOpen = true;
  }
</script>


<div class="m-4">
	{#if workspaces.length === 0}
  <Card img="https://images.inc.com/uploaded_files/image/1920x1080/getty_517610514_353435.jpg" size="none">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Boost Productivity With Workspaces Now!</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">Create dynamic workspaces to facilitate collaboration between lecturers and students.</p>
    <Button on:click={() => (isAddModalOpen = true)}>
      Create Your First Workspace <ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
    </Button>
  </Card>
	{:else}
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Workspaces</h2>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
				>
					{workspaces.length}
					{workspaces.length === 1 ? 'workspace' : 'workspaces'}
				</span>
			</div>
		</div>
		<div class="mb-4 flex items-center gap-x-3">
			<Button on:click={() => (isAddModalOpen = true)}>Add Workspace</Button>
		</div>
	</div>
	<TableSearch placeholder="Search by workspace" hoverable={true} bind:inputValue={searchTerm}>
		<TableHead>
			<TableHeadCell>Workspace</TableHeadCell>
			<TableHeadCell>Lecturer</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each filteredWorkspaces as workspace}
				<TableBodyRow>
					<TableBodyCell>
						<div class="flex items-center">
							<img src={workspace.image} alt={`${workspace.name}`} class="mr-4 h-10 w-10 rounded-full" />
							<div>
								<div class="font-semibold">{workspace.name}</div>
								<div class="text-sm text-gray-500">workspace@email.com</div>
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell>
						<div class="flex items-center">
							<img src={workspace.image} alt={`${workspace.name}`} class="mr-4 h-10 w-10 rounded-full" />
							<div>
								<div class="font-semibold">{workspace.owner}</div>
								<div class="text-sm text-gray-500">lecturer@email.com</div>
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell>
						<div class="flex space-x-4">
							<Button color="purple" on:click={() => handleEditModalOpen(workspace.id)}>
								<EditOutline class="w-5 h-5 me-2"/> Edit Workspace 
							</Button>
							<Button color="red" on:click={() => handleRemoveModalOpen(workspace.id)}>
								<TrashBinOutline class="w-5 h-5 me-2"/> Delete Workspace
							</Button>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>
	
  {/if}
</div>

<AddModal bind:open={isAddModalOpen} {lecturers} />
<EditModal bind:open={isEditModalOpen} {id} {lecturers} />
<RemoveModal bind:open={isRemoveModalOpen} {id} item="workspace" />