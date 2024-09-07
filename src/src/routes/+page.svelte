<script>
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

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
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-4 transition-colors duration-300 dark:from-green-800 dark:via-green-900 dark:to-emerald-950 sm:p-6 md:p-8"
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
	<div
		class="w-full max-w-md rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 p-6 shadow-2xl backdrop-blur-lg transition-colors duration-300 dark:border-gray-700 dark:border-opacity-50 dark:bg-gray-800 dark:bg-opacity-30 sm:max-w-lg sm:p-8 md:max-w-xl md:p-10 lg:max-w-2xl lg:p-12"
	>
		<div class="mb-6 flex justify-center sm:mb-8">
			<img
				src="images/class-connect-logo.png"
				alt="ClassConnect Logo"
				class="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40"
			/>
		</div>

		<h1
			class="mb-4 text-center text-3xl font-bold text-white dark:text-gray-100 sm:mb-6 sm:text-4xl"
		>
			Welcome to ClassConnect
		</h1>

		<p class="mb-8 text-center text-lg text-gray-100 dark:text-gray-300 sm:mb-10 sm:text-xl">
			Revolutionize your learning experience with our 3D virtual classroom environment.
		</p>

		<div class="flex flex-col items-center space-y-6">
			<p class="text-center text-base text-gray-200 dark:text-gray-400 sm:text-lg">
				Sign Up to create your organization and start hosting virtual classes.
			</p>

			<Button
				on:click={() => goto('/signup')}
				class="w-full transform rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl dark:bg-green-700 dark:hover:bg-green-800 sm:w-2/3 md:w-1/2"
			>
				Sign Up
			</Button>

			<div class="my-4 flex w-full items-center">
				<div
					class="h-px flex-grow bg-gray-300 bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50"
				></div>
				<p class="mx-4 text-gray-300 dark:text-gray-400">OR</p>
				<div
					class="h-px flex-grow bg-gray-300 bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50"
				></div>
			</div>

			<p class="text-center text-base text-gray-200 dark:text-gray-400 sm:text-lg">
				Already have an account? Sign in to access your virtual classroom.
			</p>

			<Button
				on:click={() => goto('/signin')}
				class="w-full transform rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl dark:bg-green-700 dark:hover:bg-green-800 sm:w-2/3 md:w-1/2"
			>
				Sign In
			</Button>
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
