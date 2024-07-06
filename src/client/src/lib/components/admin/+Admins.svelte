<script lang="ts">
	import AddAdmin from '$lib/components/admin/modals/add/+AddAdmin.svelte';
	import EditAdmin from '$lib/components/admin/modals/edit/+EditAdmin.svelte';
	import Remove from '$lib/components/admin/modals/remove/+Remove.svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import { user } from '$lib/store';
	import type { Org_Admin } from '$lib/store/types';
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

	let admins: Org_Admin[] = $user.getAdmins();

	let headers = ['Name', 'Admin Number', 'Email address', 'Edit'];
</script>

<section class="container mx-auto my-2 px-4">
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Admins</h2>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
				>
					{admins.length}
					{' '} admins
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
			<AddAdmin />
		</div>
	</div>

	<Table class="my-2">
		<TableHead>
			{#each headers as header}
				<TableHeadCell>{header}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each admins as admin}
				<TableBodyRow>
					<TableBodyCell class="inline-flex items-center gap-x-3">
						<div class="flex items-center gap-x-2">
							<Avatar src={admin.image} />
							<div>
								<p class="text-lg text-gray-800 dark:text-white">
									{admin.first_name}
									{admin.last_name}
								</p>
							</div>
						</div></TableBodyCell
					>
					<TableBodyCell>
						{admin.username}
					</TableBodyCell>
					<TableBodyCell>
						{admin.email}
					</TableBodyCell>
					<TableBodyCell>
						<div class="flex items-center gap-x-6">
							<Remove id={admin.id} />
							<EditAdmin adminID={admin.id} />
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</section>
