<script lang="ts">
	import { Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import { DotsVerticalOutline } from 'flowbite-svelte-icons';
	import RemoveModal from '$lib/components/modals/Delete.svelte';
	import EditModal from '$lib/components/modals/announcement/Edit.svelte';
	export let id;
	export let role;
	export let date;
	export let title;
	export let description;
	let DATE = new Date(date);
	let isEditModalOpen = false;
	let isRemoveModalOpen = false;
</script>

<div class="my-4 dark:text-gray-200">
	<div class="container rounded-lg bg-white px-2 py-6 shadow-sm dark:bg-gray-800">
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<h1 class="px-3 py-1 text-2xl font-bold dark:text-white">{title}</h1>
				<span
					class="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600 dark:bg-gray-700 dark:text-green-400"
				>
					{DATE.toDateString()}
				</span>
			</div>
			{#if role === 'lecturer'}
				<DotsVerticalOutline id="dot-menu" size="xl" class="dark:text-gray-400" />
				<Dropdown placement="bottom" triggeredBy="#dot-menu">
					<DropdownItem on:click={() => (isEditModalOpen = true)} class="dark:text-gray-200">
						Edit
					</DropdownItem>
					<DropdownDivider class="dark:border-gray-600" />
					<DropdownItem on:click={() => (isRemoveModalOpen = true)} class="dark:text-gray-200">
						Delete
					</DropdownItem>
				</Dropdown>
			{/if}
		</div>
		<div class="mt-4 px-2">
			<p class="mt-2 text-xl dark:text-gray-300">{description}</p>
		</div>
	</div>
</div>

<EditModal bind:open={isEditModalOpen} {id} />
<RemoveModal bind:open={isRemoveModalOpen} {id} />
