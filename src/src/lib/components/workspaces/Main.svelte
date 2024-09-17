<script lang="ts">
	import Card from './workspace/Card.svelte';
	import { onMount } from 'svelte';

	export let data;

	let darkMode = false;
	let contentHeight: number;

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

	// Function to calculate content height
	function calculateContentHeight() {
		const navbar = document.querySelector('nav');
		if (navbar) {
			const navbarHeight = navbar.offsetHeight;
			const spacing = 48; // 24px top + 24px bottom
			contentHeight = window.innerHeight - navbarHeight - spacing;
		}
	}

	// Initialize theme on mount and set up listener for changes
	onMount(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		updateTheme(mediaQuery.matches);

		// Listen for changes in color scheme preference
		mediaQuery.addEventListener('change', (e) => updateTheme(e.matches));

		// Calculate initial content height
		calculateContentHeight();

		// Recalculate on window resize
		window.addEventListener('resize', calculateContentHeight);

		// Cleanup listeners on component destroy
		return () => {
			mediaQuery.removeEventListener('change', updateTheme);
			window.removeEventListener('resize', calculateContentHeight);
		};
	});
</script>

<main
	class="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 transition-colors duration-300 dark:from-green-800 dark:via-green-900 dark:to-emerald-950"
>
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden">
		{#each floatingElements as element}
			<div
				class="animate-float absolute rounded-full bg-white bg-opacity-10 dark:bg-gray-300 dark:bg-opacity-10"
				style="width: {element.size}px; height: {element.size}px; left: {element.left}%; top: {element.top}%; animation-duration: {element.duration}s; animation-delay: {element.delay}s;"
			/>
		{/each}
	</div>

	<!-- Main content -->
	<div class="relative z-10 mt-24 px-4 sm:px-6 md:px-4">
		<div
			class="rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 shadow-2xl backdrop-blur-lg transition-colors duration-300 dark:border-gray-700 dark:border-opacity-50 dark:bg-gray-800 dark:bg-opacity-30"
			style="height: {contentHeight}px;"
		>
			<h1 class="p-6 text-2xl font-bold text-white dark:text-white">Workspaces</h1>

			<div class="h-[calc(100%-5rem)] overflow-y-auto p-6 pt-0">
				{#if data.workspaces && data.workspaces.length > 0}
					<div class="grid grid-cols-1 gap-4 pb-6 md:grid-cols-2 lg:grid-cols-3">
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
		overflow: hidden;
	}

	:global(.dark) {
		color-scheme: dark;
	}
</style>