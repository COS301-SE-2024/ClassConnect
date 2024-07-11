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

	import AddModal from '$lib/components/modals/user/Add.svelte';
	import RemoveModal from '$lib/components/modals/Delete.svelte';
	import EditModal from '$lib/components/modals/user/Edit.svelte';

	export let data;

	let id: string;
	let isAddModalOpen = false;
	let isEditModalOpen = false;
	let isRemoveModalOpen = false;

	const headers: string[] = ['Name', 'Username', 'Email Address'];

	function handleEditModalOpen(adminId: string) {
		id = adminId;
		isEditModalOpen = true;
	}

	function handleRemoveModalOpen(adminId: string) {
		id = adminId;
		isRemoveModalOpen = true;
	}

	$: ({ admins } = data);
</script>

<main class="container mx-auto my-2 px-4">
	{#if admins.length === 0}
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				You do not have any admins in the organisation
			</h1>

			<Button on:click={() => (isAddModalOpen = true)}>Add Admin</Button>
		</div>
	{:else}
		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Admins</h2>

					<span
						class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>
						{admins.length}
						{admins.length === 1 ? 'admin' : 'admins'}
					</span>
				</div>
			</div>
			<div class="mb-4 flex items-center gap-x-3">
				<Button on:click={() => (isAddModalOpen = true)}>Add Admin</Button>
			</div>
		</div>

		<Table class="my-2">
			<TableHead>
				{#each headers as header}
					<TableHeadCell>{header}</TableHeadCell>
				{/each}
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each admins as admin (admin.id)}
					<TableBodyRow>
						<TableBodyCell class="inline-flex items-center gap-x-3">
							<div class="flex items-center gap-x-2">
								<Avatar src={admin.image} alt={`${admin.name} ${admin.surname}`} />

								<div>
									<p class="text-lg text-gray-800 dark:text-white">
										{admin.name}
										{admin.surname}
									</p>
								</div>
							</div>
						</TableBodyCell>

						<TableBodyCell>{admin.username}</TableBodyCell>

						<TableBodyCell>{admin.email}</TableBodyCell>

						<TableBodyCell>
							<div class="flex items-center gap-x-6">
								<Button on:click={() => handleEditModalOpen(admin.id)}>
									<EditOutline />
								</Button>

								<Button color="red" on:click={() => handleRemoveModalOpen(admin.id)}>
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

<AddModal bind:open={isAddModalOpen} role="Admin" />
<EditModal bind:open={isEditModalOpen} {id} role="Admin" />
<RemoveModal bind:open={isRemoveModalOpen} {id} item="user" />
