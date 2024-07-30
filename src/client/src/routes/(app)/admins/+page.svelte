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
	$: ({ admins } = data);
	let searchTerm = '';
	$: filteredAdmins = admins.filter(
		(admin: { name: string }) => admin.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);

	import AddModal from '$lib/components/modals/user/Add.svelte';
	import RemoveModal from '$lib/components/modals/Delete.svelte';
	import EditModal from '$lib/components/modals/user/Edit.svelte';

	let id: string;
	let isAddModalOpen = false;
	let isEditModalOpen = false;
	let isRemoveModalOpen = false;

	function handleEditModalOpen(adminId: string) {
		id = adminId;
		isEditModalOpen = true;
	}

	function handleRemoveModalOpen(adminId: string) {
		id = adminId;
		isRemoveModalOpen = true;
	}
</script>

<div class="container mx-auto px-4 py-8">
	{#if admins.length === 0}
		<Card
			img="https://www.coursesonline.co.uk/wp-content/uploads/Subject-Business-Administration.jpeg?height=485&dpr=2"
			size="none"
		>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Boost Management By Adding Additional Administrators!
			</h5>
			<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
				Add new administrators to manage the organisation.
			</p>
			<Button>
				Add Your First Administrator <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
			</Button>
		</Card>
	{:else}
		<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
			<div class="mb-4 sm:mb-0">
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Administrators</h2>
					<span
						class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>
						{admins.length}
						{admins.length === 1 ? 'admin' : 'admins'}
					</span>
				</div>
			</div>
			<div class="flex items-center gap-x-3">
				<Button on:click={() => (isAddModalOpen = true)}>Add Administrator</Button>
			</div>
		</div>

		<div class="overflow-x-auto">
			<TableSearch placeholder="Search by name" hoverable={true} bind:inputValue={searchTerm}>
				<TableHead>
					<TableHeadCell class="text-sm sm:text-base">Administrator</TableHeadCell>
					<TableHeadCell class="text-sm sm:text-base">Actions</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each filteredAdmins as admin}
						<TableBodyRow>
							<TableBodyCell>
								<div class="flex items-center">
									<img
										src={admin.image}
										alt={`${admin.name}`}
										class="mr-2 h-8 w-8 rounded-full sm:mr-4 sm:h-10 sm:w-10"
									/>
									<div>
										<div class="text-sm font-semibold sm:text-base">{admin.name}</div>
										<div class="text-xs text-gray-500 sm:text-sm">{admin.email}</div>
									</div>
								</div>
							</TableBodyCell>
							<TableBodyCell>
								<div class="flex space-x-2">
									<Button
										color="purple"
										on:click={() => handleEditModalOpen(admin.id)}
										class="p-1.5 sm:p-2"
									>
										<EditOutline class="h-4 w-4 sm:h-5 sm:w-5" />
										<span class="ml-2 hidden text-sm sm:inline">Edit</span>
									</Button>
									<Button
										color="red"
										on:click={() => handleRemoveModalOpen(admin.id)}
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

<AddModal bind:open={isAddModalOpen} role="Admin" />
<EditModal bind:open={isEditModalOpen} {id} role="Admin" />
<RemoveModal bind:open={isRemoveModalOpen} {id} item="user" />

<!--
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
-->
