<script lang="ts">
	import { DotsVerticalOutline } from 'flowbite-svelte-icons';
	import { Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';

	import RemoveModal from '$lib/components/modals/Delete.svelte';
	import EditModal from '$lib/components/modals/announcement/Edit.svelte';

	export let role: string;
	export let announcement: {
		id: string;
		title: string;
		content: string;
		date: string;
		createdBy: string;
	};

	let { id, title, content, date, createdBy } = announcement;

	let DATE = new Date(date);
	let isEditModalOpen = false;
	let isRemoveModalOpen = false;
</script>

<div class="my-4" data-testid="announcement-card">
	<div class="container rounded-lg bg-white px-4 py-6 shadow-md dark:bg-gray-900 dark:shadow-lg">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-4">
				<h1
					class="text-2xl font-bold text-gray-900 dark:text-gray-100"
					data-testid="announcement-title"
				>
					{title}
				</h1>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600 dark:bg-green-800 dark:text-green-400"
					data-testid="announcement-date"
				>
					{DATE.toDateString()}
				</span>
			</div>

			{#if role === 'lecturer' || role === 'admin'}
				<div class="relative">
					<DotsVerticalOutline
						size="xl"
						id="dot-menu"
						data-testid="dots-menu"
						class="cursor-pointer text-gray-600 dark:text-gray-300"
					/>

					<Dropdown placement="bottom-end" triggeredBy="#dot-menu">
						<DropdownItem on:click={() => (isEditModalOpen = true)} data-testid="edit-option">
							Edit
						</DropdownItem>

						<DropdownDivider />

						<DropdownItem on:click={() => (isRemoveModalOpen = true)} data-testid="delete-option">
							Delete
						</DropdownItem>
					</Dropdown>
				</div>
			{/if}
		</div>

		<div class="mt-4">
			<p class="mt-2 text-xl text-gray-700 dark:text-gray-200" data-testid="announcement-content">
				{content}
			</p>
		</div>

		<div
			class="mt-2 flex justify-end text-sm text-gray-500 dark:text-gray-400"
			data-testid="announcement-author"
		>
			By: {createdBy}
		</div>
	</div>
</div>

<EditModal bind:open={isEditModalOpen} {id} />
<RemoveModal bind:open={isRemoveModalOpen} {id} item={'announcement'} />
