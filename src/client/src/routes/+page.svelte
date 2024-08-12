<script>
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
</script>

<main
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-8"
>
	<div class="w-full max-w-2xl rounded-xl bg-white bg-opacity-90 p-12 shadow-2xl backdrop-blur-sm">
		<div class="mb-8 flex justify-center">
			<img src="images/class-connect-logo.png" alt="ClassConnect Logo" class="h-40 w-40" />
		</div>

		<h1 class="mb-6 text-center text-4xl font-bold text-green-700">Welcome to ClassConnect</h1>

		<p class="mb-10 text-center text-xl text-gray-700">
			Revolutionize your learning experience with our 3D virtual classroom environment.
		</p>

		<div class="flex flex-col items-center space-y-6">
			<p class="text-center text-lg text-gray-600">
				Sign Up to create your organization and start hosting virtual classes.
			</p>

			<Button
				on:click={() => {
					goto('/signup');
				}}
				class="w-1/2 transform rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
			>
				Sign Up
			</Button>

			<p class="mx-4 flex-shrink-0 text-gray-500">OR</p>

			<p class="mt-8 text-center text-lg text-gray-600">
				Already have an account? Sign in to access your virtual classroom.
			</p>

			<Button
				on:click={() => {
					goto('/signin');
				}}
				class="w-1/2  transform rounded-lg border-2 border-green-600 bg-green-500 px-6 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-600 hover:shadow-xl"
			>
				Sign In
			</Button>
		</div>
	</div>
</main>
