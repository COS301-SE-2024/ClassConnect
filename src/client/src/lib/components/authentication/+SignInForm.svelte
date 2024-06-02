<script lang="ts">
	import Apple from '$lib/images/apple.svg';
	import Google from '$lib/images/google.svg';
	import { goto } from '$app/navigation';
	import { Input, Label, Button, A } from 'flowbite-svelte';
	import {signIn } from '../../../services/auth';

	import '@fontsource/roboto';

	// Function to store the access token in local storage
	function storeAccessToken(token: string,id: string): void {
		localStorage.setItem('accessToken', token);
		localStorage.setItem('userID', id);
		console.log("This is the ID", id);

		console.log("User ID stored:", localStorage.getItem('userID'))
	}

	// Function to handle form submission
	async function handleSubmit(event: SubmitEvent): Promise<void> {
		// Prevent the default form submission behavior
		event.preventDefault();

		// Create a FormData object from the form
		const formData = new FormData(event.target as HTMLFormElement);

		const username = formData.get('username')?.toString() ?? '';
		const password= formData.get('password')?.toString() ?? '';

		// Send a request to your server-side action
		try {
			const response = await signIn(username,  password);

			console.log('Response:', response);

			if (response && response.accessToken) {
				storeAccessToken(response.accessToken, response.sub);
				goto('/');
			}
		} catch (error) {
			console.error('Sign-ip error:', error);
			alert('Sign-in failed');
		}

		
	}
</script>

<div class="m2 flex h-screen items-center justify-center">
	<div class="rounded-xl bg-white bg-opacity-80 p-2">
		<div class="p-2 text-center">
			<h1 class="roboto text-center text-3xl font-bold">Welcome Back 👋</h1>
			<p class="">Today is a new day. It's your day. You shape it.</p>
		</div>

		<form on:submit={handleSubmit}>
			<Label for="username" class="mb-2 mt-2">Username</Label>
			<Input
				type="text"
				id="username"
				name="username"
				class="mb-2 mt-2"
				placeholder="Your username..."
				required
			/>

			<Label for="password" class="mb-2 mt-2">Password</Label>
			<Input
				type="password"
				id="password"
				name="password"
				class="mb-2 mt-2"
				placeholder="•••••••••"
				required
			/>

			<Button type="submit" class="w-full">Sign In</Button>
		</form>

		<div class="p-2">
			<div class="flex items-center">
				<div class="flex-1 border-t border-black"></div>
				<span class="px-2 text-black">Or</span>
				<div class="flex-1 border-t border-black"></div>
			</div>

			<div class="flex items-center">
				<Button class="m-2 border-[1px] border-gray-700 bg-white text-black hover:bg-gray-100">
					<img alt="Apple Logo" class="me-2 h-5 w-5" src={Apple} />
					Sign In with Apple
				</Button>
				<Button class="m-2 border-[1px] border-gray-700 bg-white text-black hover:bg-gray-100">
					<img alt="Google Logo" class="me-2 h-5 w-5" src={Google} />
					Sign In with Google
				</Button>
			</div>

			<div class="text-center">
				<p>
					Already have an account?{' '}
					<A href="/signup" class="text-blue-600">Sign Up</A>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.roboto {
		font-family: 'Roboto', sans-serif;
	}
</style>
