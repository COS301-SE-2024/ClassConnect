<script lang="ts">
	import AddStuToWork from '$lib/components/admin/modals/add/+AddStuToWork.svelte';
	import AddLecToWork from '$lib/components/admin/modals/add/+AddLecToWork.svelte';
	import EditWorkspace from '$lib/components/admin/modals/edit/+EditWorkspace.svelte';
	import AddWorkspace from '$lib/components/admin/modals/add/+AddWorkspace.svelte';

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Input,
		Button
	} from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';

	let headers = ['Name', 'Add Lecturer', 'Add Student', 'Edit'];

	export let workspaces;
</script>

<section class="container mx-auto my-2 px-4">
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Workspaces</h2>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
				>
					{workspaces.length}
					{' '} workspaces
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
			<AddWorkspace />
		</div>
	</div>

	<Table class="my-2">
		<TableHead>
			{#each headers as header}
				<TableHeadCell>{header}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each workspaces as workspace}
				<TableBodyRow>
					<TableBodyCell class="inline-flex items-center gap-x-3">
						<div class="flex items-center gap-x-2">
							<div>
								<p class="text-lg text-gray-800 dark:text-white">
									{workspace.name}
								</p>
							</div>
						</div>
					</TableBodyCell>

					<TableBodyCell>
						<AddLecToWork />
					</TableBodyCell>

					<TableBodyCell>
						<AddStuToWork />
					</TableBodyCell>

					<TableBodyCell>
						<EditWorkspace />
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</section>
