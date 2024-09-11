<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Label, Button, A, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let form;

	let loading = false;

	function activateLoading() {
		loading = true;
		return async ({ update }: { update: any }) => {
			await update();
			loading = false;
		};
	}

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

		mediaQuery.addEventListener('change', (e) => updateTheme(e.matches));

		return () => mediaQuery.removeEventListener('change', (e) => updateTheme(e.matches));
	});

	const floatingElements = Array(20)
		.fill(null)
		.map(() => ({
			size: Math.random() * 100 + 50,
			left: Math.random() * 100,
			top: Math.random() * 100,
			duration: Math.random() * 10 + 5,
			delay: Math.random() * 5
		}));
</script>

<main
	class="relative flex min-h-screen flex-col items-center justify-center overflow-auto bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-6 transition-colors duration-300 dark:from-green-800 dark:via-green-900 dark:to-emerald-950 md:p-8 lg:flex-row lg:p-10"
>
	<!-- Animated background elements -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		{#each floatingElements as element}
			<div
				class="animate-float absolute rounded-full bg-white bg-opacity-10 dark:bg-gray-300 dark:bg-opacity-10"
				style="width: {element.size}px; height: {element.size}px; left: {element.left}%; top: {element.top}%; animation-duration: {element.duration}s; animation-delay: {element.delay}s;"
			/>
		{/each}
	</div>

	<!-- Forgot Password Section -->
	<section class="z-10 w-full max-w-[494px] lg:w-1/2 lg:max-w-lg xl:max-w-xl">
		<div
			class="flex flex-col items-center rounded-xl border border-white border-opacity-20 bg-white bg-opacity-20 p-6 shadow-xl backdrop-blur-lg transition-colors duration-300 dark:border-gray-700 dark:border-opacity-50 dark:bg-gray-800 dark:bg-opacity-30 sm:p-8 md:p-10"
		>
			<div class="mb-6 flex items-center justify-center">
				<img
					class="mr-3 h-12 w-12 sm:mr-4 sm:h-16 sm:w-16"
					src="/images/class-connect-logo.png"
					alt="ClassConnect logo"
				/>
				<h1 class="text-2xl font-bold text-white dark:text-gray-100 sm:text-3xl md:text-4xl">
					ClassConnect
				</h1>
			</div>

			<div class="mb-6 w-full text-center">
				<h2 class="text-xl font-bold text-white dark:text-gray-100 sm:text-2xl">
					Forgot Your Password 🫤
				</h2>
				<p class="text-gray-200 dark:text-gray-300">Enter your email to reset your password.</p>
			</div>

			{#if form?.error}
				<p class="mt-2 text-center text-red-500">{form.error}</p>
			{/if}

			{#if form?.success}
				<p class="mt-2 text-center text-green-500">{form.success}</p>
			{/if}

			<form method="POST" use:enhance={activateLoading} class="w-full">
				<Label for="email" class="mb-2 mt-2 text-white dark:text-gray-200">Email</Label>
				<Input
					type="email"
					id="email"
					name="email"
					placeholder="name@example.com"
					size="md"
					disabled={loading}
					required
					class="mb-4"
				/>

				{#if loading}
					<Button disabled class="w-full">
						<Spinner class="me-3" size="4" color="white" data-testid="spinner" />
						Sending Reset Link
					</Button>
				{:else}
					<Button
						type="submit"
						class="mt-2 w-full transform bg-green-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg dark:bg-green-700 dark:hover:bg-green-800"
						>Send Reset Link</Button
					>
				{/if}
			</form>

			<div class="mt-4 flex w-full flex-col items-center justify-between sm:flex-row">
				<A href="/signin" class="mb-2 text-green-700 hover:underline dark:text-green-400 sm:mb-0"
					>Back to Sign In</A
				>
			</div>
		</div>
	</section>

	<!-- Image Section -->
	<section
		class="z-10 ml-8 mt-8 hidden w-full max-w-md lg:mt-0 lg:flex lg:w-1/2 lg:max-w-lg lg:items-center xl:max-w-xl"
	>
		<div
			class="max-h-[70vh] w-full overflow-hidden rounded-xl shadow-2xl lg:max-h-[calc(100vh-5rem)]"
		>
			<img alt="Bookcase" src="/images/bookcase.jpg" class="h-full w-full object-cover" />
		</div>
	</section>
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
