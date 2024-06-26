<script lang="ts">
	import { file } from '$lib/store';
	import { goto } from '$app/navigation';
	export let title;
	export let description;
	export let link;
	import cover from '$lib/images/pdf-cover.svg';

	const handleFileOpening = () => {
		file.set(link);
		goto('/student/module/study/material');
	};
</script>

<div
	class="flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-neutral-700/70"
>
	<img class="h-20 w-full rounded-t-xl" src={cover} alt="PDF preview" />
	<div class="p-4 md:p-5">
		<h3 class="text-lg font-bold text-gray-800 dark:text-white">
			{title}
		</h3>
		<p class="mt-1 text-gray-500 dark:text-neutral-400">
			{description}
		</p>
		<button
			type="button"
			class="mt-2 inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
			on:click={handleFileOpening}
		>
			Open PDF
		</button>
	</div>
</div>
