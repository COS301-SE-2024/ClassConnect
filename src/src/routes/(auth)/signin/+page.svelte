<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Label, Button, A, Spinner } from 'flowbite-svelte';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	export let form;

	let loading = false;
	let showPassword = false;

	function activateLoading() {
		loading = true;
		return async ({ update }: { update: any }) => {
			await update();
			loading = false;
		};
	}

	// Function to update theme
	function updateTheme(isDark: boolean) {
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	onMount(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		updateTheme(mediaQuery.matches);

		// Update the listener to correctly pass the event's matches property
		mediaQuery.addEventListener('change', (e) => updateTheme(e.matches));

		return () => mediaQuery.removeEventListener('change', (e) => updateTheme(e.matches));
	});

	const floatingElements = Array(20).fill(null).map(() => ({
		size: Math.random() * 100 + 50,
		left: Math.random() * 100,
		top: Math.random() * 100,
		duration: Math.random() * 10 + 5,
		delay: Math.random() * 5
	}));
</script>


<main class="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 dark:from-green-800 dark:via-green-900 dark:to-emerald-950 p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-center relative overflow-hidden transition-colors duration-300">
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		{#each floatingElements as element}
			<div
				class="absolute rounded-full bg-white bg-opacity-10 dark:bg-gray-300 dark:bg-opacity-10 animate-float"
				style="width: {element.size}px; height: {element.size}px; left: {element.left}%; top: {element.top}%; animation-duration: {element.duration}s; animation-delay: {element.delay}s;"
			/>
		{/each}
	</div>

	<!-- Login Section -->
	<section class="w-full lg:w-1/2 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl z-10">
		<div class="flex flex-col items-center bg-white dark:bg-gray-800 bg-opacity-20 dark:bg-opacity-30 backdrop-blur-lg rounded-xl shadow-xl p-6 sm:p-8 md:p-10 border border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-50 transition-colors duration-300">
			<div class="flex items-center justify-center mb-6">
				<img class="w-12 h-12 sm:w-16 sm:h-16 mr-3 sm:mr-4" src="/images/class-connect-logo.png" alt="ClassConnect logo" />
				<h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white dark:text-gray-100">ClassConnect</h1>
			</div>

			<div class="w-full text-center mb-6">
				<h2 class="text-xl sm:text-2xl font-bold text-white dark:text-gray-100">Welcome Back 👋</h2>
				<p class="text-gray-200 dark:text-gray-300">Today is a new day. It's your day. You shape it.</p>
			</div>

			{#if form?.error}
				<p class="mt-2 text-center text-red-500">{form.error}</p>
			{/if}

			<form method="POST" use:enhance={activateLoading} class="w-full">
				<Label for="username" class="mb-2 mt-2 text-white dark:text-gray-200">Username</Label>
				<Input
					type="text"
					id="username"
					name="username"
					placeholder="a12345678"
					size="md"
					disabled={loading}
					required
					class="mb-4"
				/>
				<Label for="password" class="mb-2 mt-2 text-white dark:text-gray-200">Password</Label>
				<div class="relative mb-4">
					<Input
						type={showPassword ? 'text' : 'password'}
						id="password"
						name="password"
						placeholder="•••••••••"
						disabled={loading}
						required
					/>
					<button
						type="button"
						aria-label="Toggle password visibility"
						class="absolute inset-y-0 right-0 flex items-center pr-3"
						on:click={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<EyeSlashOutline class="text-gray-500 dark:text-gray-400" />
						{:else}
							<EyeOutline class="text-gray-500 dark:text-gray-400" />
						{/if}
					</button>
				</div>

				{#if loading}
					<Button disabled class="w-full">
						<Spinner class="me-3" size="4" color="white" data-testid="spinner" />
					</Button>
				{:else}
					<Button type="submit" class="mt-2 w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">Sign In</Button>
				{/if}
			</form>

			<div class="w-full mt-4 flex flex-col sm:flex-row justify-between items-center">
				<A href="/forgot-password" class="text-white dark:text-gray-200 hover:underline mb-2 sm:mb-0">Forgot your password?</A>
				<p class="text-white dark:text-gray-200">
					Don't have an account?{' '}
					<A href="/signup" class="text-green-300 dark:text-green-400 hover:underline">Sign Up</A>
				</p>
			</div>
		</div>
	</section>

	<!-- Image Section -->
	<section class="mt-8 lg:mt-0 lg:ml-8 w-full md:w-1/2 max-w-md lg:max-w-lg xl:max-w-xl z-10">
		<div class="rounded-xl overflow-hidden shadow-2xl max-h-[70vh] md:max-h-[80vh] lg:max-h-full">
			<img
				alt="Bookcase"
				src="/images/bookcase.jpg"
				class="w-full h-auto object-cover hidden md:block"
				style="max-height: 100vh;"
			/>
		</div>
	</section>
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
