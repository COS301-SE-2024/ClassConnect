<script lang="ts">
	import { Card } from 'flowbite-svelte';
	export let degrees: Array<{ program: string; level: string; duration: string; link: string }>;
</script>

<div class="mt-6">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each degrees as degree}
			<div class="max-w-sm">
				<div class="overflow-hidden rounded-lg bg-white shadow-md">
					<a href={degree.link} class="block">
						<Card>
							<h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								{degree.program}
							</h2>
							<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
								{degree.level}
							</p>
							<p class="font-small mb-3 leading-tight text-gray-700 dark:text-gray-400">
								{degree.duration}
							</p>
						</Card>
					</a>
				</div>
			</div>
		{/each}
	</div>
</div>
