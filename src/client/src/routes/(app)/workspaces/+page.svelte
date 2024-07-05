<script lang="ts">
	import {
		Table,
		Button,
		Avatar,
		TableBody,
		TableHead,
		TableBodyRow,
		TableHeadCell,
		TableBodyCell
	} from 'flowbite-svelte';

	import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';

	import AddModal from '$lib/components/admin/modals/workspace/Add.svelte';
	import RemoveModal from '$lib/components/admin/modals/Delete.svelte';
	import EditModal from '$lib/components/admin/modals/announcement/user/Edit.svelte';

	interface Workspace {
		id: string;
		name: string;
		owner: string;
		image: string;
	}

	interface PageData {
		workspaces: Workspace[];
		lecturers: [{ id: string; name: string }];
	}

	export let data: PageData;

	let id: string;
	let isAddModalOpen = false;
	let isEditModalOpen = false;
	let isRemoveModalOpen = false;

	const headers: string[] = ['Name', 'Owner'];

	function handleEditModalOpen(lecturerId: string) {
		id = lecturerId;
		isEditModalOpen = true;
	}

	function handleRemoveModalOpen(lecturerId: string) {
		id = lecturerId;
		isRemoveModalOpen = true;
	}

	$: ({ lecturers, workspaces } = data);
</script>

<main class="container mx-auto my-2 px-4">
	{#if workspaces.length === 0}
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				You do not have any workspaces in the organisation
			</h1>

			<Button on:click={() => (isAddModalOpen = true)}>Create Workspace</Button>
		</div>
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

		<Table class="my-2">
			<TableHead>
				{#each headers as header}
					<TableHeadCell>{header}</TableHeadCell>
				{/each}
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each workspaces as workspace (workspace.id)}
					<TableBodyRow>
						<TableBodyCell class="inline-flex items-center gap-x-3">
							<div class="flex items-center gap-x-2">
								<Avatar src={workspace.image} alt={`${workspace.name}`} rounded />

								<div>
									<p class="text-lg text-gray-800 dark:text-white">{workspace.name}</p>
								</div>
							</div>
						</TableBodyCell>

						<TableBodyCell>{workspace.owner}</TableBodyCell>

						<TableBodyCell>
							<div class="flex items-center gap-x-6">
								<Button on:click={() => handleEditModalOpen(workspace.id)}>
									<EditOutline />
								</Button>

								<Button color="red" on:click={() => handleRemoveModalOpen(workspace.id)}>
									<TrashBinOutline />
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</main>

<AddModal bind:open={isAddModalOpen} {lecturers} />
<EditModal bind:open={isEditModalOpen} {id} role="Lecturer" />
<RemoveModal bind:open={isRemoveModalOpen} {id} item="workspace" />
