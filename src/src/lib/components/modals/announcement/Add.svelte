<script lang="ts">
	import { enhance } from '$app/forms';
	import Banner from '$lib/components/common/Banner.svelte';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	export let id: string;
	export let open: boolean;

	let error: string;
	let color: string;
	let message: string;
	let display: boolean = false;

	function close() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				message = 'Addition was successful';
				color = 'green';
				open = false;
				display = true;
			} else {
				error = result.data?.error;
				message = 'Addition failed';
				color = 'red';
				open = false;
				display = true;
			}
		};
	}
</script>

{#if display}
	<Banner type="Add" {color} {message} />
{/if}

<Modal bind:open size="xs" class="w-full">
	<form method="POST" action="?/post" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create Announcement</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" name="createdBy" value={id} />

		<Label for="title" class="mb-2 mt-2 text-left">Title</Label>
		<Input type="text" id="title" name="title" placeholder="Fire Drill" size="md" required />

		<Label for="content" class="mb-2 mt-2 text-left">Content</Label>
		<Input
			type="text"
			id="content"
			name="content"
			placeholder="The fire drill is as follows..."
			size="md"
			required
		/>

		<Button type="submit" class="mt-4 w-full">Post</Button>
	</form>
</Modal>
