<script>
	import '../app.css';
	import { DarkMode } from 'flowbite-svelte';
</script>

<div class="app bg-lightBgColor dark:bg-gray-700">
	<DarkMode />
	<main>
		<slot />
	</main>
</div>

<style>
</style>
