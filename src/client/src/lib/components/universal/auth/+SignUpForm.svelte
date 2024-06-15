<script lang="ts">
	import '@fontsource/roboto';
	import { goto } from '$app/navigation';
	import Apple from '$lib/images/apple.svg';
	import Google from '$lib/images/google.svg';
	import { Input, Label, Button, Checkbox, A } from 'flowbite-svelte';

	import { signUp } from '$lib/services/auth';

	function storeAccessToken(token: string): void {
		localStorage.setItem('accessToken', token);
	}

	async function handleSubmit(event: SubmitEvent): Promise<void> {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const name = formData.get('name')?.toString() ?? '';
		const surname = formData.get('surname')?.toString() ?? '';
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const confirmPassword = formData.get('confirm_password')?.toString() ?? '';
		const image = formData.get('image')?.toString() ?? '';

		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		//creates user but does not redirect to home page
		try {
			const response = await signUp(name, surname, email, image, password);

			console.log('Response:', response);

			if (response && response.accessToken) {
				storeAccessToken(response.accessToken);
				goto('/');
			}
		} catch (error) {
			console.error('Sign-up error:', error);
			alert('Sign-up failed');
		}
	}
</script>

<div class="m2 flex h-screen justify-center">
	<div class="rounded-xl bg-white bg-opacity-80 p-2">
		<h1 class="roboto text-center text-3xl font-bold">Get Started Now</h1>

		<form on:submit={handleSubmit} enctype="multipart/form-data">
			<Label for="name" class="mb-2 mt-2 dark:text-gray-800">Name</Label>
			<Input type="text" id="name" name="name" placeholder="John" size="md" required />

			<Label for="surname" class="mb-2 mt-2 dark:text-gray-800">Surname</Label>
			<Input type="text" id="surname" name="surname" placeholder="Doe" size="md" required />

			<Label for="email" class="mb-2 mt-2 dark:text-gray-800">Email</Label>
			<Input type="email" id="email" name="email" placeholder="john.doe@company.com" required />

			<Label for="password" class="mb-2 mt-2 dark:text-gray-800">Password</Label>
			<Input type="password" id="password" name="password" placeholder="•••••••••" required />

			<Label for="confirm_password" class="mb-2 mt-2 dark:text-gray-800">Confirm password</Label>
			<Input
				type="password"
				id="confirm_password"
				name="confirm_password"
				placeholder="•••••••••"
				required
			/>

			<Label for="upload_image" class="mb-2 mt-2 dark:text-gray-800">Upload profile photo:</Label>
			<Input type="text" id="image" name="image" required />

			<Checkbox class="p-2 dark:text-gray-800" id="terms" name="terms" required>
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
