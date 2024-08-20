<script lang="ts">
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { Heading } from 'flowbite-svelte';

	export let faqs: any;
</script>

<section class="bg-gray-50 dark:bg-gray-900">
	<div class="container mx-auto max-w-4xl px-6 py-16">
		<Heading
			tag="h1"
			class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl"
		>
			Frequently Asked Questions
		</Heading>

		{#each faqs as faq}
			<div class="mb-8">
				<Heading tag="h2" class="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
					{faq.category}
				</Heading>
				<Accordion flush>
					{#each faq.items as item}
						<AccordionItem>
							<svelte:fragment slot="header">
								<span class="text-lg font-medium text-gray-700 dark:text-gray-300"
									>{item.question}</span
								>
							</svelte:fragment>
							<p class="mb-2 text-gray-600 dark:text-gray-400">{item.answer}</p>
						</AccordionItem>
					{/each}
				</Accordion>
			</div>
		{/each}
	</div>
</section>
