<script lang="ts">
	import { onMount } from 'svelte';
	import { file } from '$lib/store';
	let pdf_data = 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf';
	onMount(() => {
		if (file && $file !== '') {
			pdf_data = $file;
		}
	});
</script>

<object class="pdf" data={pdf_data} width="800" height="500" title="Study Material"> </object>

<style>
	.pdf {
		width: 100%;
		aspect-ratio: 4 / 3;
		height: 100%;
		margin: 0;
		padding: 0;
	}
</style>
