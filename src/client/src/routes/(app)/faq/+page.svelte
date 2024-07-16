<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;
	import FAQ from '$lib/components/common/FAQ.svelte';
</script>

<main>
	<FAQ faqs={data.faq}/>
</main>
