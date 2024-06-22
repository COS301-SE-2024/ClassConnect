<script lang="ts">
	import { file } from '$lib/store';
	import IconFiles from '@tabler/icons-svelte/IconFiles.svelte';
	import UploadStudy from '$lib/components/lecturer/modals/+UploadStudy.svelte';
	export let files;

	function setFile(url){
		file.set(url);
	}

</script>

<div class="max-w-md rounded-xl border bg-white p-6 pb-10 text-gray-900">
	<p class="text-lg font-medium">Study Material Uploads</p>
	{#each files as file}
		<a href="/lecturer/dashboard/material">
			<button on:click={setFile(file.link)} class="w-full" type="button">
				<div class="mt-4 flex items-center rounded-lg bg-gray-100 px-2 py-1 text-gray-600">
					<IconFiles />
					<p class="p-2 text-sm">{file.title}</p>
				</div>
			</button>
		</a>
	{/each}
	<div class="m-2 flex items-center justify-center">
		<UploadStudy />
	</div>
</div>
