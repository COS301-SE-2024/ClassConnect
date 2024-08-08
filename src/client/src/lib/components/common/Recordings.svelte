<script lang="ts">
	import {
		Table,
		Button,
		TableBody,
		TableHead,
		TableBodyCell,
		TableBodyRow,
		TableHeadCell,
		Modal,
		Input
	} from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import toast, { Toaster } from 'svelte-french-toast';
	import { vid_url } from '$lib/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	export let role: string;
	export let lessons: any = [];

	let id: string;

	const headers = ['Topic', 'Description', 'Date', 'Time'];

	let open: boolean = false;

	let error: string;

	function close() {
		open = false;
		const toastId = toast.loading('Deleting...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Delete was done successfully!');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Delete Failed!: ' + error);
			}
		};
	}
</script>

<Toaster />

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
					<p class="text-lg text-gray-800 dark:text-white">{lesson.topic}</p>
				</TableBodyCell>

				<TableBodyCell>{lesson.description}</TableBodyCell>

				<TableBodyCell>{lesson.date}</TableBodyCell>

				<TableBodyCell>{lesson.time}</TableBodyCell>

				<TableBodyCell>
					<Button
						class="mr-2"
						size="sm"
						on:click={() => {
							vid_url.set(lesson.url);
							goto($page.url + '/video');
						}}
					>
						Open
					</Button>

					{#if role === 'lecturer'}
						<Button
							size="sm"
							color="red"
							on:click={() => {
								id = lesson.id;
								open = true;
								console.log('This is the id of the recording', id);
							}}
						>
							Delete
						</Button>
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal bind:open size="xs" class="text-center">
	<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
		Are you sure you want to delete this lesson?
	</h3>

	{#if error}
		<p class="mt-2 text-center text-red-500">{error}</p>
	{/if}

	<form method="POST" action="?/deleteRecording" use:enhance={close}>
		<Input type="hidden" id="id" name="id" value={id} />
		<Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
	</form>
</Modal>
