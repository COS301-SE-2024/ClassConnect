<script lang="ts">
	import FlowbiteSolid from 'flowbite-svelte-icons';
	import UploadStudy from '$lib/components/lecturer/modals/+UploadStudy.svelte';
	export let files;
</script>

<div class="max-w-md rounded-xl border bg-white p-6 pb-10 text-gray-900">
	<p class="text-lg font-medium">Object Uploads</p>
	{#each files as file}
		<div class="mt-4 flex items-center rounded-lg bg-gray-100 px-2 py-1 text-gray-600">
			<FlowbiteSolid />
			<p class="p-2 text-sm">{file.title}</p>
		</div>
	{/each}
	<div class="m-2 flex items-center justify-center">
		<UploadStudy />
	</div>
</div>
