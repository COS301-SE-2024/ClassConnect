<script>
	import Apple from '$lib/images/apple.svg';
	import Google from '$lib/images/google.svg';
	import { goto } from '$app/navigation';
	import { Input, Label, Button, Checkbox, A } from 'flowbite-svelte';
	import '@fontsource/roboto';

	// Function to store the access token in local storage
	function storeAccessToken(token) {
		localStorage.setItem('accessToken', token);
	}

	// Function to handle form submission
	async function handleSubmit(event) {
		// Prevent the default form submission behavior
		event.preventDefault();

		// Create a FormData object from the form
		const formData = new FormData(event.target);

		// Send a request to your server-side action
		const response = await fetch('/signup', {
			method: 'POST',
			body: formData
		});

		// If the request was successful, store the access token in local storage
		if (response.ok) {
			const res = await response.json();
			const data = JSON.parse(res.data);
			const accessToken = data[2];
			storeAccessToken(accessToken);
			goto('/');
		} else {
			goto('/signup');
		}
	}
</script>

<div class="m2 flex h-screen justify-center">
	<div class="rounded-xl bg-white bg-opacity-80 p-2">
		<h1 class="roboto text-center text-3xl font-bold">Get Started Now</h1>

		<form on:submit={handleSubmit} enctype="multipart/form-data">
			<Label for="name" class="mb-2 mt-2">Name</Label>
			<Input type="text" id="name" name="name" placeholder="John" size="md" required />

			<Label for="email" class="mb-2 mt-2">Email</Label>
			<Input type="email" id="email" name="email" placeholder="john.doe@company.com" required />

			<Label for="password" class="mb-2 mt-2">Password</Label>
			<Input type="password" id="password" name="password" placeholder="•••••••••" required />

			<Label for="confirm_password" class="mb-2 mt-2">Confirm password</Label>
			<Input
				type="password"
				id="confirm_password"
				name="confirm_password"
				placeholder="•••••••••"
				required
			/>

			<Label for="org_name" class="mb-2 mt-2">Organisation Name</Label>
			<Input
				type="text"
				id="org_name"
				name="org_name"
				placeholder="Example University"
				size="md"
				required
			/>

			<Label for="upload_image" class="mb-2 mt-2">Upload image:</Label>
			<Input type="file" id="image" name="image" required />

			<Checkbox class="p-2" id="terms" name="terms" required>
				I agree to the &nbsp;<A href="#" class="text-blue-600">terms and conditions</A>
			</Checkbox>

			<Button type="submit" class="w-full">Sign Up</Button>
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
					Sign Up with Apple
				</Button>
				<Button class="m-2 border-[1px] border-gray-700 bg-white text-black hover:bg-gray-100">
					<img alt="Google Logo" class="me-2 h-5 w-5" src={Google} />
					Sign Up with Google
				</Button>
			</div>

			<div class="text-center">
				<p>
					Already have an account?{' '}
					<A href="/signin" class="text-blue-600">Sign In</A>
				</p>
			</div>
		</div>
	</div>
</div>
