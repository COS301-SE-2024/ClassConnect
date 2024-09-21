<script lang="ts">
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import toast, { Toaster } from 'svelte-french-toast';
	import { enhance } from '$app/forms';

	let error: string;

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
		</Dropdown>
	</div>
</div>
