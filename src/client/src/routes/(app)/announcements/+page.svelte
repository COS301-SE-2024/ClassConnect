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

	import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';

	import AddModal from '$lib/components/admin/modals/announcement/Add.svelte';
	import Announcements from '$lib/components/universal/+Announcements.svelte';
	// import RemoveModal from '$lib/components/admin/modals/Delete.svelte';
	 import EditModal from '$lib/components/admin/modals/announcement/Edit.svelte';

	interface Announcement {
		ID:string;
		ann_id: string;
		title: string;
		description: string;
		date: string;
		type: string;
		
	}

	interface PageData {
		announcements: Announcement[];
	}

	export let data: PageData;
	let id: string;
	let isAddModalOpen = false;
	 let isEditModalOpen = false;
	// let isRemoveModalOpen = false;

	const headers: string[] = ['Title', 'Decsription', 'Date'];

	function handleEditModalOpen(annId: string) {
		id = annId;
		isEditModalOpen = true;
	}

	// function handleRemoveModalOpen(adminId: string) {
	// 	id = adminId;
	// 	isRemoveModalOpen = true;
	// }

	$: ({ announcements } = data);
</script>

<main class="container mx-auto my-2 px-4">
	{#if announcements.length === 0}
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				You do not have any Announcements in the organisation
			</h1>
			<Button on:click={() => (isAddModalOpen = true)}>Create Announcement</Button>
		</div>
	{:else}
		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Announcements</h2>
					<span class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400">
						{announcements.length} {announcements.length === 1 ? 'announcement' : 'announcements'}
					</span>
				</div>
			</div>
			<div class="mb-4 flex items-center gap-x-3">
				<Button on:click={() => (isAddModalOpen = true)}>Create Announcement</Button>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each announcements as announcement (announcement.ann_id)}
				<div class="task m-2 p-4 bg-white rounded-lg shadow-md">
					<div class="tags flex justify-between items-center">
						<span class="tag text-lg font-bold">{announcement.title}</span>
						<button class="options">
							<svg
								xml:space="preserve"
								viewBox="0 0 41.915 41.916"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								xmlns="http://www.w3.org/2000/svg"
								fill="#000000"
								width="24"
								height="24"
							>
								<g>
									<path d="M11.214,20.956c0,3.091-2.509,5.589-5.607,5.589C2.51,26.544,0,24.046,0,20.956c0-3.082,2.511-5.585,5.607-5.585 C8.705,15.371,11.214,17.874,11.214,20.956z"></path>
									<path d="M26.564,20.956c0,3.091-2.509,5.589-5.606,5.589c-3.097,0-5.607-2.498-5.607-5.589c0-3.082,2.511-5.585,5.607-5.585 C24.056,15.371,26.564,17.874,26.564,20.956z"></path>
									<path d="M41.915,20.956c0,3.091-2.509,5.589-5.607,5.589c-3.097,0-5.606-2.498-5.606-5.589c0-3.082,2.511-5.585,5.606-5.585 C39.406,15.371,41.915,17.874,41.915,20.956z"></path>
								</g>
							</svg>
						</button>
					</div>
					<p class="my-2">{announcement.description}</p>
					<div class="stats flex justify-between items-center">
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								width="24"
								height="24"
							>
								<g>
									<path stroke-linecap="round" stroke-width="2" d="M12 8V12L15 15"></path>
									<circle stroke-width="2" r="9" cy="12" cx="12"></circle>
								</g>
							</svg>
							<span class="ml-2">{announcement.date}</span>
						</div>
						<div>
							<Button class="mr-2" on:click={() => handleEditModalOpen(announcement.ann_id)}>Edit</Button>
							<Button color="red">Delete</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>
<AddModal bind:open={isAddModalOpen}  />
<EditModal bind:open={isEditModalOpen} {id} role="Admin"/>
<!-- <RemoveModal bind:open={isRemoveModalOpen} {id} item="user" /> -->
