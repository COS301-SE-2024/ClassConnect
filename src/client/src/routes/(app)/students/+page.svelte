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

	import { UserAddOutline, EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';

	import AddModal from '$lib/components/modals/user/Add.svelte';
	import RemoveModal from '$lib/components/modals/Delete.svelte';
	import EditModal from '$lib/components/modals/user/Edit.svelte';
	import EnrolModal from '$lib/components/modals/user/Enrol.svelte';

	export let data: any;

	let id: string;
	let isAddModalOpen = false;
	let isEditModalOpen = false;
	let isRemoveModalOpen = false;
	let isEnrolModalOpen = false;

	const headers: string[] = ['Name', 'Username', 'Email Address'];

	function handleEditModalOpen(studentId: string) {
		id = studentId;
		isEditModalOpen = true;
	}

	function handleEnrolModalOpen(studentId: string) {
		id = studentId;
		isEnrolModalOpen = true;
	}

	function handleRemoveModalOpen(studentId: string) {
		id = studentId;
		isRemoveModalOpen = true;
	}

	$: ({ students, workspaces } = data);
</script>

<main class="container mx-auto my-2 px-4">
	{#if students.length === 0}
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				You do not have any students in the organisation
			</h1>

			<Button on:click={() => (isAddModalOpen = true)}>Add Student</Button>
		</div>
	{:else}
		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Students</h2>

					<span
						class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>
						{students.length}
						{students.length === 1 ? 'student' : 'students'}
					</span>
				</div>
			</div>
			<div class="mb-4 flex items-center gap-x-3">
				<Button on:click={() => (isAddModalOpen = true)}>Add Student</Button>
			</div>
		</div>

		<Table class="my-2">
			<TableHead>
				{#each headers as header}
					<TableHeadCell>{header}</TableHeadCell>
				{/each}
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each students as student (student.id)}
					<TableBodyRow>
						<TableBodyCell class="inline-flex items-center gap-x-3">
							<div class="flex items-center gap-x-2">
								<Avatar src={student.image} alt={`${student.name} ${student.surname}`} />

								<div>
									<p class="text-lg text-gray-800 dark:text-white">
										{student.name}
										{student.surname}
									</p>
								</div>
							</div>
						</TableBodyCell>

						<TableBodyCell>{student.username}</TableBodyCell>

						<TableBodyCell>{student.email}</TableBodyCell>

						<TableBodyCell>
							<div class="flex items-center gap-x-6">
								<Button on:click={() => handleEditModalOpen(student.id)}>
									<EditOutline />
								</Button>

								<Button color="red" on:click={() => handleRemoveModalOpen(student.id)}>
									<TrashBinOutline />
								</Button>

								<Button color="yellow" on:click={() => handleEnrolModalOpen(student.id)}>
									<UserAddOutline />
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</main>

<AddModal bind:open={isAddModalOpen} role="Student" />
<EditModal bind:open={isEditModalOpen} {id} role="Student" />
<RemoveModal bind:open={isRemoveModalOpen} {id} item="user" />
<EnrolModal bind:open={isEnrolModalOpen} {id} {workspaces} role="Student" />
