<script>
	import { spring } from 'svelte/motion';
	import AuroraBackground from '$lib/components/utils/+AuroraBackground.svelte';

	let opacity = spring(0);
	let y = spring(40);
</script>

<AuroraBackground>
	<main
		style="opacity: {$opacity}; transform: translate3d(0, {$y}px, 0);"
		class="relative flex flex-col items-center justify-center gap-4 px-4"
		on:mouseenter={() => {
			opacity.set(1);
			y.set(0);
		}}
		on:mouseleave={() => {
			opacity.set(0);
			y.set(40);
		}}
	>
		<div class="text-center text-3xl font-bold dark:text-white md:text-7xl">
			Background lights are cool you know.
		</div>
		<div class="py-4 text-base font-extralight dark:text-neutral-200 md:text-4xl">
			And this, is chemical burn.
		</div>
		<button class="w-fit rounded-full bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
			Debug now
		</button>
	</main>
</AuroraBackground>
