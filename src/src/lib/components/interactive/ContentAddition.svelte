<script lang="ts">
	import {
		Button,
		Dropdown,
		DropdownItem,
		Modal,
		Label,
		Select,
		Input,
		Textarea
	} from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import toast, { Toaster } from 'svelte-french-toast';
	import { enhance } from '$app/forms';

	export let materials: any[];

	let error: string;
	let CreateThreeDNote = false;
	let selected: any;

	function createNote() {
		const toastId = toast.loading('Creating lesson note...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Created successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Creation Failed!: ' + error);
			}
		};
	}

	function createMCQ() {
		const toastId = toast.loading('Creating multiple choice question...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Created successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Creation Failed!: ' + error);
			}
		};
	}

	function createThreeDMaterialNote() {
		CreateThreeDNote = false;
		const toastId = toast.loading('Creating 3D material note...');
		if (!selected) {
			toast.dismiss(toastId);
			toast.error('Please select a material');
			return;
		}
		console.log(selected);
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Created successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Creation Failed!: ' + error);
			}
		};
	}
</script>

<Toaster />

<div class="flex justify-center">
	<div class="text-center">
		<Button>
			Create Content
			<ChevronDownOutline class="ms-2 h-6 w-6 text-white dark:text-white" />
		</Button>
		<Dropdown>
			<form method="POST" action="?/createNote" use:enhance={createNote}>
				<DropdownItem as="button" type="submit">Lecture Notes</DropdownItem>
			</form>
			<form method="POST" action="?/createQuestion" use:enhance={createMCQ}>
				<DropdownItem as="button" type="submit">Multiple Choice Question</DropdownItem>
			</form>
			<DropdownItem as="button" type="button" on:click={() => (CreateThreeDNote = true)}>
				3D Material Note
			</DropdownItem>
		</Dropdown>
	</div>
</div>

<Modal bind:open={CreateThreeDNote} size="md" class="w-full">
	<form
		method="POST"
		action="?/createThreeDNote"
		class="flex flex-col"
		use:enhance={createThreeDMaterialNote}
	>
		<h3 class="mb-4 justify-center text-center text-xl font-medium text-gray-900 dark:text-white">
			Create 3D Note
		</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}
		<Label for="title" class="mb-2 text-2xl">Title</Label>
		<Input type="text" id="title" name="title" placeholder="Enter title" class="mb-2" />
		<Label for="description" class="mb-2 text-2xl">Description</Label>
		<Textarea id="description" name="description" placeholder="Enter description" class="mb-2" />
		<Label>
			Select a 3D object:
			<Select class="my-2" bind:value={selected}>
				{#each materials as option}
					<option value={option.id}>{option.title}</option>
				{/each}
			</Select>
		</Label>
		<Input type="hidden" id="material" name="material" value={selected} />
		<Button type="submit" class="mt-4 w-full">Create 3D note</Button>
	</form>
</Modal>
