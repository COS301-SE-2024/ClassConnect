<script lang="ts">
	import { Input, Label, Button, Select, Modal } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import {
		ExclamationCircleOutline,
		TrashBinOutline,
		ArchiveArrowDownOutline
	} from 'flowbite-svelte-icons';
	import toast, { Toaster } from 'svelte-french-toast';
	import { enhance } from '$app/forms';

	export let materials: any[];
	export let note: any;

	let options: any = [];
	let selected = note.content;

	$: selected;

	onMount(async () => {
		materials.map((material: any) => {
			let option = {
				value: material.title,
				link: material.file_path
			};
			options.push(option);
		});
		console.log(note);
	});

	let error: string;
	let open = false;

	function save() {
		const toastId = toast.loading('Saving notes...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Saved successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Deletion Failed!: ' + error);
			}
		};
	}

	function remove() {
		const toastId = toast.loading('Deleting note...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Deleted successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Deletion Failed!: ' + error);
			}
		};
	}
</script>

<Toaster />

<main class="container mx-auto p-4">
	<div class="p-2 md:px-5 md:py-2">
		<form method="POST" action="?/editContent" use:enhance={save}>
			<div class="grid grid-cols-12 gap-6">
				<div class="col-span-10">
					<div class="mb-6">
						<Label for="title" class="mb-2 text-2xl">Title</Label>
						<Input
							type="text"
							id="title"
							name="title"
							placeholder={note.title}
							value={note.title}
						/>
					</div>
					<div>
						<div class="flex justify-center p-3">
							<section
								class="flex h-[500px] w-[500px] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
							>
								<div class="flex-1">
									<object
										id="pdf-file"
										class="h-full w-full flex-grow"
										data={selected}
										title="Study Material"
									/>
								</div>
							</section>
						</div>
					</div>
					<Label>
						Select a pdf file:
						<Select class="mt-2" bind:value={selected}>
							{#each materials as option}
								<option value={option.file_path}>{option.title}</option>
							{/each}
						</Select>
					</Label>
					<Input type="hidden" id="id" name="id" value={note.id} />
					<Input type="hidden" id="content" name="content" value={selected} />
				</div>
				<div class="col-span-2">
					<div
						class="w-48 justify-center rounded-lg border border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					>
						<div
							class="relative inline-flex w-full items-center justify-center rounded-t-lg border-b border-gray-200 px-4 py-2 text-sm font-medium focus:z-10 focus:text-green-700 focus:ring-2 focus:ring-green-700 dark:border-gray-600 dark:focus:text-white dark:focus:ring-gray-500"
						>
							Actions
						</div>
						<button
							type="button"
							on:click={() => (open = true)}
							class="hover:text-red-700dark:border-gray-600 relative inline-flex w-full items-center border-b border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-red-700 dark:hover:bg-gray-600"
						>
							<TrashBinOutline
								class="mr-2 text-gray-500 transition-colors duration-200 hover:text-red-500"
							/>
							Remove Notes
						</button>
						<button
							type="submit"
							class="relative inline-flex w-full items-center rounded-b-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-green-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							<ArchiveArrowDownOutline class="mr-2 text-gray-500" />
							Save Notes
						</button>
					</div>
				</div>
			</div>
		</form>
	</div>
</main>

<Modal bind:open size="xs" class="text-center">
	<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
		Are you sure you want to delete this notes slide?
	</h3>

	{#if error}
		<p class="mt-2 text-center text-red-500">{error}</p>
	{/if}

	<form method="POST" action="?/deleteContent" use:enhance={remove}>
		<Input type="hidden" id="id" name="id" value={note.id} />
		<Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
	</form>
</Modal>
