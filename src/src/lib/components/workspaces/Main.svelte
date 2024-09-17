<script lang="ts">
	import Card from './workspace/Card.svelte';
	import { onMount } from 'svelte';

	export let data;

	let darkMode = false;

	// Function to generate random floating elements
	const floatingElements = Array(20)
		.fill()
		.map(() => ({
			size: Math.random() * 100 + 50,
			left: Math.random() * 100,
			top: Math.random() * 100,
			duration: Math.random() * 10 + 5,
			delay: Math.random() * 5
		}));

	// Function to update theme
	function updateTheme(isDark) {
		darkMode = isDark;
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	// Initialize theme on mount and set up listener for changes
	onMount(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		updateTheme(mediaQuery.matches);

		// Listen for changes in color scheme preference
		mediaQuery.addEventListener('change', (e) => updateTheme(e.matches));

		// Cleanup listener on component destroy
		return () => mediaQuery.removeEventListener('change', updateTheme);
	});
</script>

<main
	class="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-4 transition-colors duration-300 dark:from-green-800 dark:via-green-900 dark:to-emerald-950 sm:p-6 md:p-8"
>
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden z-10">
		{#each floatingElements as element}
			<div
				class="animate-float absolute rounded-full bg-white bg-opacity-10 dark:bg-gray-300 dark:bg-opacity-10"
				style="width: {element.size}px; height: {element.size}px; left: {element.left}%; top: {element.top}%; animation-duration: {element.duration}s; animation-delay: {element.delay}s;"
			/>
		{/each}
	</div>

	<!-- Main content -->
	<div
		class="z-20 mt-24 rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 p-6 shadow-2xl backdrop-blur-lg transition-colors duration-300 dark:border-gray-700 dark:border-opacity-50 dark:bg-gray-800 dark:bg-opacity-30"
	>
		<h1 class="text-2xl font-bold text-white dark:text-white">Workspaces</h1>

		<div class="mt-2">
			{#if data.workspaces && data.workspaces.length > 0}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data.workspaces as workspace}
						<Card {workspace} role={data.role} />
					{/each}
				</div>
			{:else}
				<div class="mt-4 text-center">
					<p class="text-lg text-gray-200 dark:text-gray-300">
						You haven't been assigned to any workspaces yet.
					</p>

					<p class="mt-2 text-sm text-gray-300 dark:text-gray-400">
						Please contact your administrator if you believe this is an error.
					</p>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	@keyframes float {
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	.animate-float {
		animation: float 3s ease-in-out infinite;
	}

	:global(body) {
		overflow: auto;
	}

	:global(.dark) {
		color-scheme: dark;
	}
</style>