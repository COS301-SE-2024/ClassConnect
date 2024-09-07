<script>
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
</script>

<main class="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-4 sm:p-6 md:p-8 flex items-center justify-center">
	<div class="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12">
		<div class="mb-6 sm:mb-8 flex justify-center">
			<img src="images/class-connect-logo.png" alt="ClassConnect Logo" class="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40" />
		</div>

		<h1 class="mb-4 sm:mb-6 text-center text-3xl sm:text-4xl font-bold text-green-700">Welcome to ClassConnect</h1>

		<p class="mb-8 sm:mb-10 text-center text-lg sm:text-xl text-gray-700">
			Revolutionize your learning experience with our 3D virtual classroom environment.
		</p>

		<div class="flex flex-col items-center space-y-6">
			<p class="text-center text-base sm:text-lg text-gray-600">
				Sign Up to create your organization and start hosting virtual classes.
			</p>

			<Button
				on:click={() => goto('/signup')}
				class="w-full sm:w-2/3 md:w-1/2 transform rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
			>
				Sign Up
			</Button>

			<div class="flex items-center w-full my-4">
				<div class="flex-grow h-px bg-gray-300"></div>
				<p class="mx-4 text-gray-500">OR</p>
				<div class="flex-grow h-px bg-gray-300"></div>
			</div>

			<p class="text-center text-base sm:text-lg text-gray-600">
				Already have an account? Sign in to access your virtual classroom.
			</p>

			<Button
				on:click={() => goto('/signin')}
				class="w-full sm:w-2/3 md:w-1/2 transform rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
			>
				Sign In
			</Button>
		</div>
	</div>
</main>