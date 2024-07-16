<script lang="ts">
	export let faqs: any;

</script>

<section class="bg-white dark:bg-gray-900">
	<div class="container mx-auto max-w-4xl px-6 py-10">
		<h1 class="text-center text-2xl font-semibold text-gray-800 dark:text-white lg:text-3xl">
			Frequently asked questions
		</h1>

		{#each faqs as faq}
			<h1 class="text-center pt-2 text-2xl font-semibold text-gray-800 dark:text-white lg:text-3xl">
				{faq.category}
			</h1>
			<div class="mt-12 space-y-8">
				{#each faq.items as item}
					<div class="rounded-lg border-2 border-gray-100 dark:border-gray-700">
						<button class="flex w-full items-center justify-between p-8">
							<h1 class="font-semibold text-gray-700 dark:text-white">{item.question}</h1>

							<span class="rounded-full bg-gray-200 text-gray-400">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M18 12H6"
									/>
								</svg>
							</span>
						</button>

						<hr class="border-gray-200 dark:border-gray-700" />

						<p class="p-8 text-sm text-gray-500 dark:text-gray-300">
							{item.answer}
						</p>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>