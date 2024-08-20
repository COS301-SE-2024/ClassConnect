<script lang="ts">
	import { Modal, Spinner } from 'flowbite-svelte';
	export let loading: boolean;
	export let text: string;
</script>

<Modal
	open={loading}
	size="xs"
	autoclose={false}
	class="relative flex h-32 w-32 flex-col items-center justify-center rounded-lg bg-white shadow dark:bg-gray-700"
	dismissable={false}
>
	<div class="flex flex-col items-center justify-center">
		<Spinner color="green" size={8} class="mb-4" />
		<p class="text-center text-lg">{text}...</p>
	</div>
</Modal>
