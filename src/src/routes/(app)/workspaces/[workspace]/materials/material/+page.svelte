<script lang="ts">
	import { objURL } from '$src/lib/store/objects';
	let pdf_data = 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf';

	if ($objURL !== '') {
		pdf_data = $objURL;
	}
</script>

<main class="flex h-full items-center justify-center">
	<iframe class="h-[100vh] w-full flex-grow" src={pdf_data} frameborder="0" title="Study Material"
	></iframe>
</main>
