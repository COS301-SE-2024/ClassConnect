<script lang="ts">
	import {
		Table,
		Button,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		TableBody,
		TableHead,
		TableBodyCell,
		TableBodyRow,
		TableHeadCell
	} from 'flowbite-svelte';
	import {
		DotsVerticalOutline,
		TrashBinOutline,
		EyeOutline,
		EditOutline,
		EyeSlashOutline
	} from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DeleteModal from '$lib/components/modals/interactive/DeleteModal.svelte';
	import PublicModal from '$src/lib/components/modals/interactive/PublicationModal.svelte';
	import EditModal from '$lib/components/modals/interactive/EditModal.svelte';

	export let role: string;
	export let lessons: any[];

	let id: string;
	let description: string;
	let instructions: string;
	let publication: string;
	let title: string;

	let isEditModalOpen = false;
	let isPublicModalOpen = false;
	let isDeleteModalOpen = false;

	const headers = ['Title', 'Description', 'Action(s)'];

	function handleEdit(lesson: any) {
		id = lesson.id;
		description = lesson.description;
		instructions = lesson.instructions;
		title = lesson.title;
		isEditModalOpen = true;
	}

	function handleMakePublic(in_id: string, in_publication: boolean) {
		id = in_id;
		if (in_publication) {
			publication = 'private';
		} else {
			publication = 'public';
		}
		isPublicModalOpen = true;
	}

	function handleDelete(in_id: string) {
		id = in_id;
		isDeleteModalOpen = true;
	}
</script>

<main class="container mx-auto p-4">
	{#if lessons.length > 0}
		<Table class="my-2">
			<TableHead>
				{#each headers as header}
					<TableHeadCell>{header}</TableHeadCell>
				{/each}
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each lessons as lesson}
					<TableBodyRow>
						<TableBodyCell class="inline-flex items-center gap-x-3">
							<p class="text-lg text-gray-800 dark:text-white">{lesson.title}</p>
						</TableBodyCell>

						<TableBodyCell>{lesson.description}</TableBodyCell>

						<TableBodyCell>
							<div class="align-center flex">
								<Button class="mr-2" size="sm" on:click={() => goto($page.url + '/' + lesson.id)}>
									Open
								</Button>
								{#if role === 'lecturer'}
									<DotsVerticalOutline
										id="card-dot-menu-{lesson.id}"
										size="xl"
										class="dark:text-gray-400"
									/>
									<Dropdown placement="right" triggeredBy={`#card-dot-menu-${lesson.id}`}>
										<DropdownItem
											class="flex dark:text-gray-200"
											on:click={() => handleEdit(lesson)}
										>
											<EditOutline class="me-2 dark:text-gray-400" />
											Edit
										</DropdownItem>
										<DropdownItem
											class="flex dark:text-gray-200"
											on:click={() => handleMakePublic(lesson.id, lesson.isAvailable)}
										>
											{#if lesson.isAvailable}
												<EyeSlashOutline class="me-2 dark:text-gray-400" />
												Make Private
											{:else}
												<EyeOutline class="me-2 dark:text-gray-400" />
												Make Public
											{/if}
										</DropdownItem>
										<DropdownDivider class="dark:border-gray-600" />
										<DropdownItem
											class="flex dark:text-gray-200"
											on:click={() => handleDelete(lesson.id)}
										>
											<TrashBinOutline color="red" class="me-2 dark:text-red-400" />
											Delete
										</DropdownItem>
									</Dropdown>
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</main>

<EditModal bind:open={isEditModalOpen} {id} {title} {description} {instructions} />

<PublicModal bind:open={isPublicModalOpen} {id} {publication} />

<DeleteModal bind:open={isDeleteModalOpen} {id} />
