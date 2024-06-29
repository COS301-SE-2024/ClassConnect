<script>
	import { enhance } from '$app/forms';
	import { Button } from 'flowbite-svelte';
</script>

<main
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-4"
>
	<div class="w-full max-w-md rounded-lg bg-white bg-opacity-90 p-8 shadow-xl backdrop-blur-sm">
		<h1 class="mb-6 text-center text-3xl font-bold text-green-700">Sign Out</h1>

		<p class="mb-8 text-center text-gray-700">Class Connect will miss you.</p>

		<form method="POST" use:enhance>
			<Button type="submit" color="red" class="w-full">Sign Out</Button>
		</form>
	</div>
</main>
