<script lang="ts">
	import { onMount } from 'svelte';
	import { lecturers, lecChange } from '$lib/store';
	import { getUsers } from '$lib/services/users';
	import AddLecturer from '$lib/components/admin/modals/add/+AddLecturer.svelte';
	import EditLecturer from '$lib/components/admin/modals/edit/+EditLecturer.svelte';
	import Remove from '$lib/components/admin/modals/remove/+Remove.svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Avatar,
		Input,
		Button
	} from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';

	async function loadLecturers() {
		try {
			const users = await getUsers({ role: 'lecturer' });
			lecturers.set(users);
		} catch (error) {
			lecturers.set([]);
		}
	}

	let headers = ['Name', 'Employee Number', 'Email address', 'Edit'];

	onMount(loadLecturers);

	$: {
		lecChange.subscribe(() => {
			loadLecturers();
		});
	}
</script>

<section class="container mx-auto my-2 px-4">
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Lecturers</h2>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
				>
					{$lecturers.length}
					{' '} lecturers
				</span>
			</div>
		</div>

		<div class="relative mb-4 flex items-center md:mt-0">
			<Input id="search" placeholder="Search" size="lg">
				<SearchOutline slot="left" class="h-6 w-6 text-gray-500 dark:text-gray-400" />
				<Button slot="right" size="sm" type="submit">Search</Button>
			</Input>
		</div>

		<div class="mb-4 flex items-center gap-x-3">
			<AddLecturer />
		</div>
	</div>

	<Table class="my-2">
		<TableHead>
			{#each headers as header}
				<TableHeadCell>{header}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each $lecturers as lecturer}
				<TableBodyRow>
					<TableBodyCell class="inline-flex items-center gap-x-3">
						<div class="flex items-center gap-x-2">
							<Avatar src={lecturer.image} />
							<div>
								<p class="text-lg text-gray-800 dark:text-white">
									{lecturer.name}
									{lecturer.surname}
								</p>
							</div>
						</div></TableBodyCell
					>
					<TableBodyCell>
						{lecturer.username}
					</TableBodyCell>
					<TableBodyCell>
						{lecturer.email}
					</TableBodyCell>
					<TableBodyCell>
						<div class="flex items-center gap-x-6">
							<Remove id={lecturer._id} />
							<EditLecturer lecturerID={lecturer._id} />
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</section>
