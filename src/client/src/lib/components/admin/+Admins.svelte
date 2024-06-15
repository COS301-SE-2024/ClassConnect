<script lang="ts">
	import { onMount } from 'svelte';
	import { admins, admChange } from '$lib/store';
	import { getUsers } from '../../services/users';
	import AddAdmin from '$lib/components/admin/modals/add/+AddAdmin.svelte';
	import EditAdmin from '$lib/components/admin/modals/edit/+EditAdmin.svelte';
	import Remove from '$lib/components/admin/modals/remove/+Remove.svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Avatar,
		Breadcrumb,
		BreadcrumbItem,
		Input,
		Button
	} from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';

	let headers = ['Name', 'Admin Number', 'Email address', 'Edit'];

	async function loadAdmins() {
		try {
			const users = await getUsers({ role: 'admin' });
			admins.set(users);
		} catch (error) {
			admins.set([]);
		}
	}

	onMount(loadAdmins);

	$: {
		admChange.subscribe(() => {
			loadAdmins();
		});
	}
</script>

<section class="container mx-auto my-2 px-4">
	<div class="flex items-center overflow-x-auto whitespace-nowrap py-4">
		<Breadcrumb aria-label="Default breadcrumb example">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem href="/admins">Admins</BreadcrumbItem>
		</Breadcrumb>
	</div>

	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Admins</h2>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
				>
					{$admins.length}
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
			{#each $admins as admin}
				<TableBodyRow>
					<TableBodyCell class="inline-flex items-center gap-x-3">
						<div class="flex items-center gap-x-2">
							<Avatar src={admin.image} />
							<div>
								<p class="text-lg text-gray-800 dark:text-white">
									{admin.name}
									{admin.surname}
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
							<Remove id={admin._id} />
							<EditAdmin adminID={admin._id} />
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</section>
