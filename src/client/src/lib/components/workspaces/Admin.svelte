<script lang="ts">
	import {
		Card,
		Button,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableSearch
	} from 'flowbite-svelte';
	import { ArrowRightOutline, EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';

	export let data;
	$: ({ lecturers, workspaces } = data);

	let searchTerm = '';
	$: filteredWorkspaces = workspaces.filter(
		(workspace: { name: string; owner: string }) =>
			workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			workspace.owner.toLowerCase().includes(searchTerm.toLowerCase())
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

<div class="container mx-auto px-4 py-8">
	{#if workspaces.length === 0}
		<Card
			img="https://images.inc.com/uploaded_files/image/1920x1080/getty_517610514_353435.jpg"
			size="lg"
			class="mx-auto max-w-md"
		>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Boost Productivity With Workspaces Now!
			</h5>
			<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
				Create dynamic workspaces to facilitate collaboration between lecturers and students.
			</p>
			<Button on:click={() => (isAddModalOpen = true)} class="w-full sm:w-auto">
				Create Your First Workspace <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
			</Button>
		</Card>
	{:else}
		<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
			<div class="mb-4 sm:mb-0">
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
			<div class="flex items-center gap-x-3">
				<Button on:click={() => (isAddModalOpen = true)}>Add Workspace</Button>
			</div>
		</div>

		<div class="overflow-x-auto">
			<TableSearch placeholder="Search by workspace" hoverable={true} bind:inputValue={searchTerm}>
				<TableHead>
					<TableHeadCell class="text-sm sm:text-base">Workspace</TableHeadCell>
					<TableHeadCell class="text-sm sm:text-base">Lecturer</TableHeadCell>
					<TableHeadCell class="text-sm sm:text-base">Actions</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each filteredWorkspaces as workspace}
						<TableBodyRow>
							<TableBodyCell>
								<div class="flex items-center">
									<img
										src={workspace.image}
										alt={`${workspace.name}`}
										class="mr-2 h-8 w-8 rounded-full sm:mr-4 sm:h-10 sm:w-10"
									/>
									<div class="text-sm font-semibold sm:text-base">{workspace.name}</div>
								</div>
							</TableBodyCell>
							<TableBodyCell>
								<div class="flex items-center">
									<img
										src={workspace.image}
										alt={`${workspace.name}`}
										class="mr-2 h-8 w-8 rounded-full sm:mr-4 sm:h-10 sm:w-10"
									/>
									<div>
										<div class="text-sm font-semibold sm:text-base">{workspace.owner}</div>
										<div class="text-xs text-gray-500 sm:text-sm">lecturer@email.com</div>
									</div>
								</div>
							</TableBodyCell>
							<TableBodyCell>
								<div class="flex space-x-2">
									<Button
										color="purple"
										on:click={() => handleEditModalOpen(workspace.id)}
										class="p-1.5 sm:p-2"
									>
										<EditOutline class="h-4 w-4 sm:h-5 sm:w-5" />
										<span class="ml-2 hidden text-sm sm:inline">Edit</span>
									</Button>
									<Button
										color="red"
										on:click={() => handleRemoveModalOpen(workspace.id)}
										class="p-1.5 sm:p-2"
									>
										<TrashBinOutline class="h-4 w-4 sm:h-5 sm:w-5" />
										<span class="ml-2 hidden text-sm sm:inline">Delete</span>
									</Button>
								</div>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</TableSearch>
		</div>
	{/if}
</div>

<AddModal bind:open={isAddModalOpen} {lecturers} />
<EditModal bind:open={isEditModalOpen} {id} {lecturers} />
<RemoveModal bind:open={isRemoveModalOpen} {id} item="workspace" />
