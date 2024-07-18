<script lang="ts">
  import { Card, Button, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, TableSearch } from 'flowbite-svelte';
  import { ArrowRightOutline, EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import NoStudentCard from '$lib/components/common/ZeroUsersCard.svelte';
	
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

<div class="container mx-auto px-2 sm:px-4 py-8">
  {#if students.length === 0}
	<NoStudentCard 
		imgSrc="https://media.wired.com/photos/647e7400d96882f74caa3e5c/16:9/w_2400,h_1350,c_limit/Don't-Want-Students-To-Rely-On-ChatGPT-Ideas-1356557660.jpg"
		title="Aspiring Minds, Shaping the Future - Students Embark on a Journey of Discovery!"
		description="Students are the foundation upon which the edifice of knowledge is built, their inquisitive minds and eager spirits driving the progress of humanity."
		buttonText="Add Your First Student"
	/>
  {:else}
		<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
			<div class="mb-4 sm:mb-0">
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Students</h2>
					<span class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400">
						{students.length}
						{students.length === 1 ? 'student' : 'students'}
					</span>
				</div>
			</div>
			<div class="flex items-center gap-x-3">
        <Button on:click={() => (isAddModalOpen = true)}>Add Student</Button>
      </div>
    </div>
		<div class="overflow-x-auto">
    	<TableSearch placeholder="Search by name" hoverable={true} bind:inputValue={searchTerm}>
    	  <TableHead>
    	    <TableHeadCell class="text-sm sm:text-base">Student</TableHeadCell>
    	    <TableHeadCell class="text-sm sm:text-base">Username</TableHeadCell>
    	    <TableHeadCell class="text-sm sm:text-base">Actions</TableHeadCell>
    	  </TableHead>
    	  <TableBody tableBodyClass="divide-y">
    	    {#each filteredStudents as student}
    	      <TableBodyRow>
    	        <TableBodyCell>
    	          <div class="flex items-center">
    	            <img src={student.image} alt={student.name} class="mr-2 sm:mr-4 h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
    	            <div>
    	              <div class="font-semibold text-sm sm:text-base">{student.name}</div>
                    <div class="text-xs sm:text-sm text-gray-500">{student.email}</div>
    	            </div>
    	          </div>
    	        </TableBodyCell>
    	        <TableBodyCell>
                  <div class="font-semibold text-sm sm:text-base">{student.username}</div>
							</TableBodyCell>
    	        <TableBodyCell>
    	          <div class="flex space-x-2">
    	            <Button color="purple" on:click={() => handleEditModalOpen(student.id)} class="p-1.5 sm:p-2">
    	              <EditOutline class="w-4 h-4 sm:w-5 sm:h-5" />
                    <span class="hidden sm:inline ml-2 text-sm">Edit</span>
    	            </Button>
    	            <Button color="red" on:click={() => handleRemoveModalOpen(student.id)} class="p-1.5 sm:p-2">
    	              <TrashBinOutline class="w-4 h-4 sm:w-5 sm:h-5" />
                    <span class="hidden sm:inline ml-2 text-sm">Delete</span>
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

<AddModal bind:open={isAddModalOpen} role="Student" />
<EditModal bind:open={isEditModalOpen} {id} role="Student" />
<RemoveModal bind:open={isRemoveModalOpen} {id} item="user" />
<EnrolModal bind:open={isEnrolModalOpen} {id} {workspaces} role="Student" />