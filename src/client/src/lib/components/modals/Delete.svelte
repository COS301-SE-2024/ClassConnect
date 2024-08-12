<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Input } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import toast, { Toaster } from 'svelte-french-toast';

	export let id: string;
	export let item: string;
	export let open: boolean;

	function close() {
		return ({ result, update }: any) => {
			const promise = new Promise((resolve, reject) => {
				setTimeout(async () => {
					try {
						if (result.type === 'success') {
							await update();
							open = false;
							resolve('Deleted successfully!');
						} else {
							reject(result.data?.error || 'An unknown error occurred');
						}
					} catch (error) {
						reject(error);
					}
				}, 500);
			});

			toast.promise(promise, {
				loading: 'Deleting ...',
				success: (message) => `${message}`,
				error: (error) => `${error}`
			});

			return promise;
		};
	}
</script>

<Toaster />
<Modal bind:open size="xs">
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this {item}? Are you sure you want to delete this {item}?
		</h3>

		<form method="POST" action="?/delete" use:enhance={close}>
			<Input type="hidden" id="id" name="id" value={id} />

			<Button color="red" class="me-2" type="submit">Yes, I'm sure</Button>
			<Button color="alternative" on:click={() => (open = false)}>No, cancel</Button>
		</form>
	</div>
</Modal>
