<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';

	export let data: PageData;

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
			class="items-center rounded-xl border border-white border-opacity-20 bg-white bg-opacity-20 p-6 shadow-xl backdrop-blur-lg transition-colors duration-300 dark:border-gray-700 dark:border-opacity-50 dark:bg-gray-800 dark:bg-opacity-30 sm:p-8 md:p-10"
		>
			<div class="mb-6 w-full text-center">
				<h2 class="text-xl font-bold text-white dark:text-gray-100 sm:text-2xl">Signing Out</h2>
				<p class="text-gray-200 dark:text-gray-300">Are you sure you want to sign out?</p>
			</div>

			<form method="POST" use:enhance={activateLoading} class="w-full">
				<div class="flex flex-col justify-between gap-4 lg:flex-row">
					<Button
						type="submit"
						class="mt-2 w-full transform bg-green-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg dark:bg-green-700 dark:hover:bg-green-800"
						disabled={loading}
					>
						<span>{loading ? 'Loading...' : 'Yes, I am sure'}</span>
					</Button>
					<Button
						class="mt-2 w-full transform bg-red-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-red-700 hover:shadow-lg dark:bg-red-700 dark:hover:bg-red-800"
						on:click={() => goto(data.role === 'lecturer' ? '/workspaces' : '/dashboard')}
					>
						No, cancel
					</Button>
				</div>
			</form>
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
