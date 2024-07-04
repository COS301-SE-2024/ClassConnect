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

	import AddModal from '$lib/components/admin/modals/add/Lecturer.svelte';

	interface Lecturer {
		id: string;
		name: string;
		surname: string;
		username: string;
		email: string;
		image: string;
	}

	interface PageData {
		lecturers: Lecturer[];
	}

	export let data: PageData;

	let isAddModalOpen = false;

	const headers: string[] = ['Name', 'Username', 'Email Address'];

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
								<!-- <Remove id={lecturer.id} />
								<AddToWorkSpace id={lecturer.id} />
								<EditLecturer lecturerID={lecturer.id} /> -->
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</main>

<AddModal bind:open={isAddModalOpen} />
