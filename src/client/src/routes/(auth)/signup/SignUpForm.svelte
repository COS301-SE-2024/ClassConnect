<script lang="ts">
	import '@fontsource/roboto';
	import { enhance } from "$app/forms";
	import { Input, Label, Button, A } from 'flowbite-svelte';

	export let form;
</script>

<div class="flex justify-center items-center h-screen">
	<div class="rounded-xl bg-white bg-opacity-80 p-4 w-1/2">
		<h1 class="font-roboto text-center text-3xl font-bold">Get Started Now</h1>

		{#if form?.error}
			<p class="text-red-500 text-center mt-2">{form.error}</p>
		{/if}

		<form method='POST' use:enhance>
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

			<Button type="submit" class="w-full my-4">Sign Up</Button>
		</form>

		<div class="p-2">
			<div class="text-center">
				<p>
					Already have an account?{' '}
					<A href="/signin" class="text-blue-600">Sign In</A>
				</p>
			</div>
		</div>
	</div>
</div>
