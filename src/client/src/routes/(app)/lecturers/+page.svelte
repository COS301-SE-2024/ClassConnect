<script lang="ts">
	import {
		Button,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableSearch
	} from 'flowbite-svelte';
	import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import NoLecturerCard from '$lib/components/common/ZeroUsersCard.svelte';

	import AddModal from '$lib/components/modals/user/Add.svelte';
	import RemoveModal from '$lib/components/modals/Delete.svelte';
	import EditModal from '$lib/components/modals/user/Edit.svelte';
	import NoAccess from '$lib/components/common/PageUnavailable.svelte';

	export let data;

	let id: string;
	let _name: string;
	let surname: string;
	let email: string;

	let isAddModalOpen = false;
	let isEditModalOpen = false;
	let isRemoveModalOpen = false;

	function handleEditModalOpen(lecturerId: string, lecturerName: string, lecturerSurname: string, lecturerEmail: string) {
		id = lecturerId;
		_name = lecturerName;
		surname = lecturerSurname;
		email = lecturerEmail;
		isEditModalOpen = true;
	}

	function handleRemoveModalOpen(lecturerId: string) {
		id = lecturerId;
		isRemoveModalOpen = true;
	}

	$: ({ lecturers ,organisation } = data);

	let searchTerm = '';
	$: filteredLecturers = lecturers.filter(
		(lecturer:any) =>
			lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			lecturer.username.toLowerCase().includes(searchTerm.toLowerCase())
	);
</script>


{#if organisation === undefined}
<NoAccess/>
{:else}
<div class="container mx-auto px-4 py-8">
	{#if lecturers.length === 0}
		<NoLecturerCard 
			imgSrc="https://www.paulconnollycomms.co.uk/wp-content/uploads/2023/02/shutterstock_1955321449-scaled.jpg"
			title="Ignite Minds And Inspire Greatness!"
			description="Lecturers are the catalysts who transform classrooms into dynamic hubs of learning and growth, empowering students to reach their full potential."
			buttonText="Add Your First Lecturer"
			role="Lecturer"
		/>
	{:else}
		<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
			<div class="mb-4 sm:mb-0">
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Lecturers</h2>
					<span
						class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>
						{lecturers.length}
						{lecturers.length === 1 ? 'lecturer' : 'lecturers'}
					</span>
				</div>
			</div>
			<div class="flex items-center gap-x-3">
				<Button on:click={() => (isAddModalOpen = true)}>Add Lecturer</Button>
			</div>
		</div>

		<div class="overflow-x-auto">
			<TableSearch placeholder="Search by name" hoverable={true} bind:inputValue={searchTerm}>
				<TableHead>
					<TableHeadCell class="text-sm sm:text-base">Lecturer</TableHeadCell>
					<TableHeadCell class="text-sm sm:text-base">Username</TableHeadCell>
					<TableHeadCell class="text-sm sm:text-base">Actions</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each filteredLecturers as lecturer}
						<TableBodyRow>
							<TableBodyCell>
								<div class="flex items-center">
									<img
										src={lecturer.image}
										alt={`${lecturer.name}`}
										class="mr-2 h-8 w-8 rounded-full sm:mr-4 sm:h-10 sm:w-10"
									/>
									<div>
										<div class="text-sm font-semibold sm:text-base">{lecturer.name}</div>
										<div class="text-xs text-gray-500 sm:text-sm">{lecturer.email}</div>
									</div>
								</div>
							</TableBodyCell>
							<TableBodyCell>
								<div class="truncate text-sm font-semibold sm:text-base">{lecturer.username}</div>
							</TableBodyCell>
							<TableBodyCell>
								<div class="flex space-x-2">
									<Button
										color="purple"
										on:click={() => handleEditModalOpen(lecturer.id, lecturer.name, lecturer.surname, lecturer.email)}
										class="p-1.5 sm:p-2"
									>
										<EditOutline class="h-4 w-4 sm:h-5 sm:w-5" />
										<span class="ml-2 hidden text-sm sm:inline">Edit</span>
									</Button>
									<Button
										color="red"
										on:click={() => handleRemoveModalOpen(lecturer.id)}
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

<AddModal bind:open={isAddModalOpen} role="Lecturer" />
<EditModal bind:open={isEditModalOpen} {id} {_name} {surname} {email} role="Lecturer" />
<RemoveModal bind:open={isRemoveModalOpen} {id} />

{/if}
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

	export let data: any;

	let id: string;
	let isAddModalOpen = false;
	let isEditModalOpen = false;
	let isRemoveModalOpen = false;

	const headers: string[] = ['Name', 'Username', 'Email Address'];

	function handleEditModalOpen(lecturerId: string) {
		id = lecturerId;
		isEditModalOpen = true;
	}

	function handleRemoveModalOpen(lecturerId: string) {
		id = lecturerId;
		isRemoveModalOpen = true;
	}

	$: ({ lecturers } = data);
</script>

<main class="container mx-auto my-2 px-4">
	{#if lecturers.length === 0}
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				You do not have any lecturers in the organisation
			</h1>

			<Button on:click={() => (isAddModalOpen = true)}>Add Lecturer</Button>
		</div>
	{:else}
		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Lecturers</h2>

					<span
						class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>
						{lecturers.length}
						{lecturers.length === 1 ? 'lecturer' : 'lecturers'}
					</span>
				</div>
			</div>
			<div class="mb-4 flex items-center gap-x-3">
				<Button on:click={() => (isAddModalOpen = true)}>Add Lecturer</Button>
			</div>
		</div>

		<Table class="my-2">
			<TableHead>
				{#each headers as header}
					<TableHeadCell>{header}</TableHeadCell>
				{/each}
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each lecturers as lecturer (lecturer.id)}
					<TableBodyRow>
						<TableBodyCell class="inline-flex items-center gap-x-3">
							<div class="flex items-center gap-x-2">
								<Avatar src={lecturer.image} alt={`${lecturer.name} ${lecturer.surname}`} />

								<div>
									<p class="text-lg text-gray-800 dark:text-white">
										{lecturer.name}
										{lecturer.surname}
									</p>
								</div>
							</div>
						</TableBodyCell>

						<TableBodyCell>{lecturer.username}</TableBodyCell>

						<TableBodyCell>{lecturer.email}</TableBodyCell>

						<TableBodyCell>
							<div class="flex items-center gap-x-6">
								<Button on:click={() => handleEditModalOpen(lecturer.id)}>
									<EditOutline />
								</Button>

								<Button color="red" on:click={() => handleRemoveModalOpen(lecturer.id)}>
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

<AddModal bind:open={isAddModalOpen} role="Lecturer" />
<EditModal bind:open={isEditModalOpen} {id} role="Lecturer" />
<RemoveModal bind:open={isRemoveModalOpen} {id} item="user" />
-->
