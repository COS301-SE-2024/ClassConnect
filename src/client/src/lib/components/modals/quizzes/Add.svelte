<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		Textarea,
		Toolbar,
		ToolbarGroup,
		ToolbarButton,
		Button,
		Modal,
		Label,
		Input
	} from 'flowbite-svelte';
	import {
		PaperClipOutline,
		MapPinAltSolid,
		ImageOutline,
		CodeOutline,
		FaceGrinOutline
	} from 'flowbite-svelte-icons';

	export let open: boolean;

	let error: string;

	function close() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				open = false;
			} else {
				error = result.data?.error;
			}
		};
	}
</script>

<Modal bind:open size="xs" class="w-full">
	<form method="POST" action="?/post" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add Quiz</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Label for="title" class="mb-2 mt-2 text-left">Title</Label>
		<Input type="text" id="title" name="title" placeholder="Quiz Title..." size="md" required />

		<Label for="duration" class="mb-2 mt-2 text-left">Duration (in minutes)</Label>
		<Input
			type="number"
			id="duration"
			name="duration"
			placeholder="30"
			size="md"
			required
			min="0"
		/>

		<Label for="instructions" class="mb-2 mt-2 text-left">Add Instructions</Label>
		<Textarea
			id="instructions"
			name="instructions"
			rows="8"
			class="mb-4"
			placeholder="Write a comment"
		>
			<Toolbar slot="header" embedded>
				<ToolbarGroup>
					<ToolbarButton name="Attach file"
						><PaperClipOutline class="h-6 w-6 rotate-45" /></ToolbarButton
					>
					<ToolbarButton name="Embed map"><MapPinAltSolid class="h-6 w-6" /></ToolbarButton>
					<ToolbarButton name="Upload image"><ImageOutline class="h-6 w-6" /></ToolbarButton>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton name="Format code"><CodeOutline class="h-6 w-6" /></ToolbarButton>
					<ToolbarButton name="Add emoji"><FaceGrinOutline class="h-6 w-6" /></ToolbarButton>
				</ToolbarGroup>
			</Toolbar>
		</Textarea>

		<Button type="submit" class="mt-4 w-full">Create Quiz</Button>
	</form>
</Modal>
