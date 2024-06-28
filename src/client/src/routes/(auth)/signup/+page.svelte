<script lang="ts">
	import '@fontsource/roboto';
	import { enhance } from '$app/forms';
	import { Input, Label, Button, A, Spinner } from 'flowbite-svelte';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';

	export let form;

	let loading = false;
	let showPassword = false;
</script>

<main class="flex">
	<section class="w-1/2" style="z-index: 1;">
		<div class="flex h-screen flex-col items-center justify-center">
			<div class="m-4 flex items-center justify-center">
				<img class="w-1/4" src="/images/class-connect-logo.png" alt="class connect logo" />
				<h1 class="font-roboto m-4 text-5xl font-bold">Class Connect</h1>
			</div>

			<div class="w-1/2 rounded-xl bg-white bg-opacity-80 p-4">
				<h1 class="font-roboto text-center text-3xl font-bold">Get Started Now</h1>
				{#if form?.error}
					<p class="mt-2 text-center text-red-500">{form.error}</p>
				{/if}
				<form
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<Label for="name" class="mb-2 mt-2 dark:text-gray-800">Name</Label>
					<Input
						type="text"
						id="name"
						name="name"
						placeholder="John"
						size="md"
						disabled={loading}
						required
					/>
					<Label for="surname" class="mb-2 mt-2 dark:text-gray-800">Surname</Label>
					<Input
						type="text"
						id="surname"
						name="surname"
						placeholder="Doe"
						size="md"
						disabled={loading}
						required
					/>
					<Label for="email" class="mb-2 mt-2 dark:text-gray-800">Email</Label>
					<Input
						type="email"
						id="email"
						name="email"
						placeholder="john.doe@company.com"
						disabled={loading}
						required
					/>
					<Label for="password" class="mb-2 mt-2 dark:text-gray-800">Password</Label>
					<div class="relative">
						<Input
							type={showPassword ? 'text' : 'password'}
							id="password"
							name="password"
							placeholder="•••••••••"
							disabled={loading}
							required
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3"
							on:click={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeSlashOutline class="text-gray-500" />
							{:else}
								<EyeOutline class="text-gray-500" />
							{/if}
						</button>
					</div>
					<Label for="confirm_password" class="mb-2 mt-2 dark:text-gray-800">Confirm password</Label
					>
					<div class="relative">
						<Input
							type="password"
							id="confirm_password"
							name="confirm_password"
							placeholder="•••••••••"
							disabled={loading}
							required
						/>
					</div>
					<Button type="submit" class="my-4 w-full">
						{#if loading}
							<Spinner class="me-3" size="4" color="white" />
						{:else}
							Sign Up
						{/if}
					</Button>
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
	</section>

	<section class="w-1/2" style="z-index: 1;">
		<div class="m2 flex h-screen items-center justify-center">
			<img
				alt="Bookcase"
				src="/images/bookcase.jpg"
				class="h-[97%] w-[97%] rounded-xl object-cover"
			/>
		</div>
	</section>
</main>
