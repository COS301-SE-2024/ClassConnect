<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import { UserSolid } from 'flowbite-svelte-icons';

	import DeleteModal from '$lib/components/modals/Delete.svelte';
	import EditModal from '$lib/components/modals/organisation/Edit.svelte';
	import CreateModal from '$lib/components/modals/organisation/Add.svelte';

	export let data: any;

	let isEditModalOpen = false;
	let isCreateModalOpen = false;
	let isDeleteModalOpen = false;

	$: ({ id, name, image, created, stats } = data);
</script>

<main class="container mx-auto px-4 py-8">
	{#if id}
		<div class="flex flex-col items-center">
			<img src={image} alt="{name} logo" class="mb-4 h-32 w-32 rounded-full shadow-lg" />
			<h1 class="mb-6 text-3xl font-bold text-gray-800 dark:text-white">{name}</h1>

			<p class="my-2 text-gray-500 dark:text-white">Created: <strong>{created}</strong></p>

			<div class="flex space-x-4">
				<Button on:click={() => (isEditModalOpen = true)}>Edit</Button>
				<Button color="red" on:click={() => (isDeleteModalOpen = true)}>Delete</Button>
			</div>

			<div class="mt-8 grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
				<Card>
					<div class="flex items-center">
						<UserSolid class="mr-4 h-10 w-10 text-blue-600" />

						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
							<p class="text-2xl font-semibold text-gray-900 dark:text-white">{stats.numAdmins}</p>
						</div>
					</div>
				</Card>

				<Card>
					<div class="flex items-center">
						<UserSolid class="mr-4 h-10 w-10 text-green-600" />

						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Lecturers</p>
							<p class="text-2xl font-semibold text-gray-900 dark:text-white">
								{stats.numLecturers}
							</p>
						</div>
					</div>
				</Card>

				<Card>
					<div class="flex items-center">
						<UserSolid class="mr-4 h-10 w-10 text-purple-600" />

						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Students</p>
							<p class="text-2xl font-semibold text-gray-900 dark:text-white">
								{stats.numStudents}
							</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	{:else}
		<div class="text-center">
			<h2 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				You do not have an organisation yet
			</h2>

			<Button on:click={() => (isCreateModalOpen = true)}>Create Organisation</Button>
		</div>
	{/if}
</main>

<CreateModal bind:open={isCreateModalOpen} />
<EditModal bind:open={isEditModalOpen} {id} _name={name} />
<DeleteModal bind:open={isDeleteModalOpen} {id} />
