<script lang="ts">
	import { Card } from 'flowbite-svelte';
	export let workspaces: Array<{ title: string; description: string; image: string }>;
</script>

<div class="mt-6">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each workspaces as workspace}
			<div class="max-w-sm">
				<div class="overflow-hidden rounded-lg bg-white shadow-md">
					<Card img={workspace.image}>
						<h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							{workspace.title}
						</h2>
						<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
							{workspace.description}
						</p>
					</Card>
				</div>
			</div>
		{/each}
	</div>
</div>
