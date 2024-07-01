<script lang="ts">
	import '@fontsource/roboto';
	import { Input, Label, Button, A, Spinner } from 'flowbite-svelte';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';

	export let form;

	let loading = false;
	let showPassword = false;

	async function handleSubmit(event) {
		event.preventDefault();
		loading = true;
		const formData = new FormData(event.target);
		try {
			const response = await fetch('/signin', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();
			if (response.ok) {
				// Handle successful response
				console.log('Success:', result);
			} else {
				// Handle error response
				form.error = result.error || 'An error occurred';
			}
		} catch (error) {
			form.error = 'An error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<main class="flex">
	<section class="w-1/2" style="z-index: 1;">
		<div class="flex h-screen flex-col items-center">
			<div class="m-4 flex items-center justify-center">
				<img class="w-1/4" src="/images/class-connect-logo.png" alt="class connect logo" />
				<h1 class="font-roboto m-4 text-5xl font-bold">Class Connect</h1>
			</div>

			<div class="w-1/2 rounded-xl bg-white bg-opacity-80 p-4">
				<div class="p-2 text-center">
					<h1 class="roboto text-center text-3xl font-bold">Welcome Back 👋</h1>
					<p class="">Today is a new day. It's your day. You shape it.</p>
				</div>

				{#if form?.error}
					<p class="mt-2 text-center text-red-500">{form.error}</p>
				{/if}

				<form method="POST" on:submit={handleSubmit}>
					<Label for="username" class="mb-2 mt-2 dark:text-gray-800">Username</Label>
					<Input
						type="text"
						id="username"
						name="username"
						placeholder="a12345678"
						size="md"
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
							aria-label="Toggle password visibility"
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

					{#if loading}
						<Button disabled class="my-4 w-full">
							<Spinner class="me-3" size="4" color="white" data-testid="spinner" />
						</Button>
					{:else}
						<Button type="submit" class="my-4 w-full">Sign In</Button>
					{/if}
				</form>
				<div class="p-2">
					<div class="text-center">
						<p>
							Don't have an account?{' '}
							<A href="/signup" class="text-blue-600">Sign Up</A>
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