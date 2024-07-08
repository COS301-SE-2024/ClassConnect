<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import confetti from 'canvas-confetti';

	let name = '';

	onMount(() => {
		name = $page.url.searchParams.get('name') || '';

		const duration = 5 * 1000;
		const animationEnd = Date.now() + duration;

		const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

		const confettiInterval = setInterval(() => {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(confettiInterval);
			}

			confetti({
				particleCount: 3,
				startVelocity: 0,
				spread: 120,
				origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
				colors: ['#004d00', '#009900', '#00cc00'],
				shapes: ['circle', 'square'],
				gravity: randomInRange(0.4, 0.6),
				scalar: randomInRange(0.8, 1.2),
				drift: randomInRange(-0.4, 0.4)
			});
		}, 50);

		return () => clearInterval(confettiInterval);
	});
</script>

<div class="flex h-screen items-center justify-center bg-gradient-to-r from-green-300 to-green-600">
	<div class="rounded-xl bg-white p-8 text-center shadow-lg">
		<h1 class="mb-4 text-4xl font-bold text-gray-800">👋 Welcome aboard {name}!</h1>

		<p class="mb-6 text-lg text-gray-600">Your account has been successfully created.</p>
		<p class="mb-6 text-xl text-gray-700">
			We've sent you an email with your new username and sign in and create your organisation.
		</p>
		<p class="text-gray-600">We are glad to have you as part of our community!</p>
	</div>
</div>
