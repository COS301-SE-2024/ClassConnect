<script lang="ts">
	import { onMount } from 'svelte';
	import { students, stuChange } from '$lib/stores/store';
	import { getUsers } from '../../../services/users';
	import AddStudent from '$lib/components/modals/+AddStudent.svelte';
	import EditStudent from '$lib/components/modals/+EditStudent.svelte';
	import Remove from '$lib/components/modals/+Remove.svelte';
	import { Table, TableBody, TableBodyCell, 
	TableBodyRow, TableHead, TableHeadCell, 
	Avatar, Breadcrumb, BreadcrumbItem,
	Input, Button} from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	
	async function loadStudents() {
		try {
			const users = await getUsers({ role: 'student' });
			students.set(users);
		} catch (error) {
			students.set([]);
		}
	}

	let headers = ["Name", "Student Number", "Email address", "Edit"];
	

	onMount(loadStudents);

	$: {
		stuChange.subscribe(() => {
			loadStudents();
		});
	}
</script>

<section class="container mx-auto my-2 px-4">
	<div class="flex items-center overflow-x-auto whitespace-nowrap py-4">
		<Breadcrumb aria-label="Default breadcrumb example">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem href="/students">Students</BreadcrumbItem>
		</Breadcrumb>
	</div>

	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Students</h2>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>{$students.length} {' '} students</span
				>
			</div>
		</div>

		<div class="relative mb-4 flex items-center md:mt-0">
			<Input id="search" placeholder="Search" size="lg">
				<SearchOutline slot="left" class="w-6 h-6 text-gray-500 dark:text-gray-400" />
				<Button slot="right" size="sm" type="submit">Search</Button>
			</Input>
		</div>

		<div class="mb-4 flex items-center gap-x-3">
			<AddStudent />
		</div>
	</div>
	  
	<Table class="my-2">
		<TableHead>
			{#each headers as header, index}
			<TableHeadCell>{header}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each $students as student}
			<TableBodyRow>
				<TableBodyCell class="inline-flex items-center gap-x-3">
					<div class="flex items-center gap-x-2">
						<Avatar src={student.image} />
					<div>
						<p class="text-lg text-gray-800 dark:text-white">
							{student.name} {student.surname}
						</p>
					</div>
				</TableBodyCell>
				<TableBodyCell>
					{student.username}
				</TableBodyCell>
				<TableBodyCell>
					{student.email}
				</TableBodyCell>
				<TableBodyCell>
					<div class="flex items-center gap-x-6">
						<Remove id={student._id} />
						<EditStudent studentID={student._id} />
					</div>
				</TableBodyCell>
			</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</section>