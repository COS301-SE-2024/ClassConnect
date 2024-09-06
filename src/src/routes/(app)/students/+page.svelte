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
	import {
		EditOutline,
		TrashBinOutline,
		ArrowRightOutline,
		UserAddSolid
	} from 'flowbite-svelte-icons';

	import AddModal from '$lib/components/modals/user/Add.svelte';
	import RemoveModal from '$lib/components/modals/Delete.svelte';
	import EditModal from '$lib/components/modals/user/Edit.svelte';
	import EnrolModal from '$lib/components/modals/user/Enrol.svelte';
	import NoAccess from '$lib/components/common/PageUnavailable.svelte';

	let isAddModalOpen = false;
	let isEditModalOpen = false;
	let isRemoveModalOpen = false;
	let isEnrolModalOpen = false;

	export let data;
	$: ({ students, workspaces, organisation } = data);
	let assignedWorkspaces: any[] = [];
	let searchTerm = '';
	$: filteredStudents = students.filter(
		(student: any) =>
			student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.username.toLowerCase().includes(searchTerm.toLowerCase())
	);

	let id: string;
	let _name: string;
	let surname: string;
	let email: string;

	function handleEditModalOpen(
		studentId: string,
		studentName: string,
		studentSurname: string,
		studentEmail: string
	) {
		id = studentId;
		_name = studentName;
		surname = studentSurname;
		email = studentEmail;
		isEditModalOpen = true;
	}

	function handleEnrolModalOpen(studentId: string, studentWorkspaces: any) {
		assignedWorkspaces = [...studentWorkspaces];
		id = studentId;
		isEnrolModalOpen = true;
	}

	function handleRemoveModalOpen(studentId: string) {
		id = studentId;
		isRemoveModalOpen = true;
	}
</script>

{#if organisation == undefined}
	<NoAccess />
{:else}
	<div class="container mx-auto h-[calc(100vh-64px)] px-4 py-8">
		{#if students.length === 0}
			<img class="mb-4 h-1/2 w-full rounded-lg" alt="workspace" src="/images/students.jpg" />

			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Aspiring Minds, Shaping the Future - Students Embark on a Journey of Discovery!
			</h5>

			<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
				Students are the foundation upon which the edifice of knowledge is built, their inquisitive
				minds and eager spirits driving the progress of humanity.
			</p>

			<Button on:click={() => (isAddModalOpen = true)} class="w-full sm:w-auto">
				Add Your First Student <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
			</Button>
		{:else}
			<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div class="mb-4 sm:mb-0">
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

				<div class="flex items-center gap-x-3">
					<Button on:click={() => (isAddModalOpen = true)}>Add Student</Button>
				</div>
			</div>

			<div class="overflow-x-auto">
				<TableSearch placeholder="Search by name" hoverable={true} bind:inputValue={searchTerm}>
					<TableHead>
						<TableHeadCell class="text-sm sm:text-base">Student</TableHeadCell>
						<TableHeadCell class="text-sm sm:text-base">Username</TableHeadCell>
					</TableHead>

					<TableBody tableBodyClass="divide-y">
						{#each filteredStudents as student}
							<TableBodyRow>
								<TableBodyCell>
									<div class="flex items-center">
										<img
											src={student.image}
											alt={student.name}
											class="mr-2 h-8 w-8 rounded-full sm:mr-4 sm:h-10 sm:w-10"
										/>

										<div>
											<div class="text-sm font-semibold sm:text-base">
												{student.name}
												{student.surname}
											</div>
											<div class="text-xs text-gray-500 sm:text-sm">{student.email}</div>
										</div>
									</div>
								</TableBodyCell>

								<TableBodyCell>
									<div class="text-sm font-semibold sm:text-base">{student.username}</div>
								</TableBodyCell>

								<TableBodyCell>
									<div class="flex justify-center space-x-2">
										<Button
											color="yellow"
											on:click={() => handleEnrolModalOpen(student.id, student.workspaces)}
											class="p-1.5 sm:p-2"
										>
											<UserAddSolid class="h-4 w-4 sm:h-5 sm:w-5" />
											<span class="ml-2 hidden text-sm sm:inline">Enrol/Unenrol</span>
										</Button>

										<Button
											on:click={() =>
												handleEditModalOpen(
													student.id,
													student.name,
													student.surname,
													student.email
												)}
											class="p-1.5 sm:p-2"
										>
											<EditOutline class="h-4 w-4 sm:h-5 sm:w-5" />
											<span class="ml-2 hidden text-sm sm:inline">Edit</span>
										</Button>

										<Button
											color="red"
											on:click={() => handleRemoveModalOpen(student.id)}
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

	<AddModal bind:open={isAddModalOpen} role="Student" />
	<EditModal bind:open={isEditModalOpen} {id} {_name} {surname} {email} role="Student" />
	<RemoveModal bind:open={isRemoveModalOpen} {id} item={'student'} />
	<EnrolModal bind:open={isEnrolModalOpen} {id} {workspaces} {assignedWorkspaces} role="Student" />
{/if}
