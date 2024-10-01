<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { Button, Spinner } from 'flowbite-svelte';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	export let form;

	const token = $page.params.token;

	let loading = false;
	let successful = false;
	let showPassword = false;
	let darkMode = false;

	function activateLoading() {
		loading = true;

		return async ({ result, update }: { update: any }) => {
			await update();

			loading = false;

			if (result.type === 'success') successful = true;
		};
	}

	// Function to update theme
	function updateTheme(isDark: boolean) {
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
				src="/images/class-connect-logo.png"
				alt="ClassConnect Logo"
				class="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40"
			/>
		</div>

		<h1
			class="mb-4 text-center text-3xl font-bold text-white dark:text-gray-100 sm:mb-6 sm:text-4xl"
		>
			Reset Password
		</h1>

		{#if successful}
			<div class="text-center">
				<p class="mb-8 text-lg text-gray-100 dark:text-gray-300 sm:mb-10 sm:text-xl">
					Your password has been reset successfully.
				</p>
				<Button
					href="/signin"
					class="w-full transform rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl dark:bg-green-700 dark:hover:bg-green-800 sm:w-2/3 md:w-1/2"
				>
					Go back to Sign In
				</Button>
			</div>
		{:else}
			<p class="mb-8 text-center text-lg text-gray-100 dark:text-gray-300 sm:mb-10 sm:text-xl">
				Enter your new password below.
			</p>

			{#if form?.error}
				<p class="mb-4 text-center text-red-500">{form.error}</p>
			{/if}

			<form method="POST" use:enhance={activateLoading} class="space-y-4">
				<input type="hidden" name="token" value={token} />

				<div>
					<label for="password" class="mb-2 block text-sm font-medium text-gray-100 dark:text-gray-300"
						>New Password</label
					>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							name="password"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
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
								<EyeSlashOutline class="text-gray-500" />
							{:else}
								<EyeOutline class="text-gray-500" />
							{/if}
						</button>
					</div>
				</div>

				<div>
					<label
						for="confirmPassword"
						class="mb-2 block text-sm font-medium text-gray-100 dark:text-gray-300"
						>Confirm New Password</label
					>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
						placeholder="•••••••••"
						disabled={loading}
						required
					/>
				</div>

				{#if loading}
					<Button disabled class="w-full">
						<Spinner class="me-3" size="4" color="white" data-testid="spinner" />
						Resetting Password
					</Button>
				{:else}
					<Button
						type="submit"
						class="w-full transform rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl dark:bg-green-700 dark:hover:bg-green-800"
						>Reset Password</Button
					>
				{/if}
			</form>
		{/if}
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