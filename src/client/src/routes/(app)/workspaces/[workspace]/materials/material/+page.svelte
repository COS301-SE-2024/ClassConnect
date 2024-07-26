<script lang="ts">
	import { objURL } from '$src/lib/store/objects';
	let pdf_data = 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf';

	if ($objURL !== '') {
		pdf_data = $objURL;
	}
</script>

<main class="flex flex-col">
	<object class="w-full flex-grow" data={pdf_data} title="Study Material" />
</main>
