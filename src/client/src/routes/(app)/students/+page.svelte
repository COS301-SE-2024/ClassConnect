<script lang="ts">
  import { Card, Button, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, TableSearch } from 'flowbite-svelte';
  import { ArrowRightOutline, EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	
  export let data;
  $: ({ students, workspaces } = data);
  let searchTerm = '';
  $: filteredStudents = students.filter((student: { name: string; }) => 
    student.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );

  import AddModal from '$lib/components/modals/user/Add.svelte';
  import RemoveModal from '$lib/components/modals/Delete.svelte';
  import EditModal from '$lib/components/modals/user/Edit.svelte';
  import EnrolModal from '$lib/components/modals/user/Enrol.svelte';

  let id: string;
  let isAddModalOpen = false;
  let isEditModalOpen = false;
  let isRemoveModalOpen = false;
  let isEnrolModalOpen = false;

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
</script>

<div class="m-4">
  {#if workspaces.length === 0}
	<Card 
	img="https://media.wired.com/photos/647e7400d96882f74caa3e5c/16:9/w_2400,h_1350,c_limit/Don't-Want-Students-To-Rely-On-ChatGPT-Ideas-1356557660.jpg"
	class="[&>img]:h-[200px] [&>img]:sm:h-[250px] [&>img]:md:h-[300px] [&>img]:lg:h-[350px] [&>img]:xl:h-[400px] [&>img]:object-cover"
	size="none"
>
	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Aspiring Minds, Shaping the Future - Students Embark on a Journey of Discovery!</h5>
	<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">Students are the foundation upon which the edifice of knowledge is built, their inquisitive minds and eager spirits driving the progress of humanity.</p>
	<Button on:click={() => (isAddModalOpen = true)}>
		Add Your First Student <ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
	</Button>
</Card>
  {:else}
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-x-3">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white">Students</h2>
          <span class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400">
            {students.length}
            {students.length === 1 ? 'student' : 'students'}
          </span>
        </div>
      </div>
      <div class="mb-4 flex items-center gap-x-3">
        <Button on:click={() => (isAddModalOpen = true)}>Add Student</Button>
      </div>
    </div>
    <TableSearch placeholder="Search by name" hoverable={true} bind:inputValue={searchTerm}>
      <TableHead>
        <TableHeadCell>Student</TableHeadCell>
        <TableHeadCell>Username</TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each filteredStudents as student}
          <TableBodyRow>
            <TableBodyCell>
              <div class="flex items-center">
                <img src={student.image} alt={student.name} class="mr-4 h-10 w-10 rounded-full" />
                <div>
                  <div class="font-semibold">{student.name}</div>
                  <div class="text-sm text-gray-500">{student.email}</div>
                </div>
              </div>
            </TableBodyCell>
            <TableBodyCell>{student.username}</TableBodyCell>
            <TableBodyCell>
              <div class="flex space-x-4">
                <Button color="purple" on:click={() => handleEditModalOpen(student.id)}>
                  <EditOutline class="w-5 h-5 me-2"/> Edit Student 
                </Button>
                <Button color="red" on:click={() => handleRemoveModalOpen(student.id)}>
                  <TrashBinOutline class="w-5 h-5 me-2"/> Delete Student
                </Button>
              </div>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </TableSearch>
  {/if}
</div>

<AddModal bind:open={isAddModalOpen} role="Student" />
<EditModal bind:open={isEditModalOpen} {id} role="Student" />
<RemoveModal bind:open={isRemoveModalOpen} {id} item="user" />
<EnrolModal bind:open={isEnrolModalOpen} {id} {workspaces} role="Student" />
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
-->