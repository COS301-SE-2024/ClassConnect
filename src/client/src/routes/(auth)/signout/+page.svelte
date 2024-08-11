<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-4"
>
	<div class="w-full max-w-md rounded-lg bg-white bg-opacity-90 p-8 shadow-xl backdrop-blur-sm">
		<h1 class="mb-6 text-center text-3xl font-bold text-green-700">Sign Out</h1>

		<p class="mb-8 text-center text-gray-700">Are you sure you want to sign out?</p>

		<form method="POST" use:enhance class="flex">
			<Button type="submit" color="red" class="mx-2 w-full">Yes, I am sure</Button>

			<Button
				class="mx-2 w-full"
				on:click={() => goto(data.role === 'lecturer' ? '/workspaces' : '/dashboard')}
			>
				No, cancel
			</Button>
		</form>
	</div>
</main>
