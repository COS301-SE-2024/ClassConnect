<script>
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let darkMode = false;

	// Function to generate random floating elements
	const floatingElements = Array(20).fill().map(() => ({
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

<main class="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 dark:from-green-800 dark:via-green-900 dark:to-emerald-950 p-4 sm:p-6 md:p-8 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden">
		{#each floatingElements as element}
			<div
				class="absolute rounded-full bg-white bg-opacity-10 dark:bg-gray-300 dark:bg-opacity-10 animate-float"
				style="width: {element.size}px; height: {element.size}px; left: {element.left}%; top: {element.top}%; animation-duration: {element.duration}s; animation-delay: {element.delay}s;"
			/>
		{/each}
	</div>

	<!-- Main content -->
	<div class="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-lg rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-50 transition-colors duration-300">
		<div class="mb-6 sm:mb-8 flex justify-center">
			<img src="images/class-connect-logo.png" alt="ClassConnect Logo" class="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40" />
		</div>

		<h1 class="mb-4 sm:mb-6 text-center text-3xl sm:text-4xl font-bold text-white dark:text-gray-100">Welcome to ClassConnect</h1>

		<p class="mb-8 sm:mb-10 text-center text-lg sm:text-xl text-gray-100 dark:text-gray-300">
			Revolutionize your learning experience with our 3D virtual classroom environment.
		</p>

		<div class="flex flex-col items-center space-y-6">
			<p class="text-center text-base sm:text-lg text-gray-200 dark:text-gray-400">
				Sign Up to create your organization and start hosting virtual classes.
			</p>

			<Button
				on:click={() => goto('/signup')}
				class="w-full sm:w-2/3 md:w-1/2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
			>
				Sign Up
			</Button>

			<div class="flex items-center w-full my-4">
				<div class="flex-grow h-px bg-gray-300 bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50"></div>
				<p class="mx-4 text-gray-300 dark:text-gray-400">OR</p>
				<div class="flex-grow h-px bg-gray-300 bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50"></div>
			</div>

			<p class="text-center text-base sm:text-lg text-gray-200 dark:text-gray-400">
				Already have an account? Sign in to access your virtual classroom.
			</p>

			<Button
				on:click={() => goto('/signin')}
				class="w-full sm:w-2/3 md:w-1/2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
			>
				Sign In
			</Button>
		</div>
	</div>
</main>

<style>
	@keyframes float {
		0% { transform: translateY(0px); }
		50% { transform: translateY(-20px); }
		100% { transform: translateY(0px); }
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