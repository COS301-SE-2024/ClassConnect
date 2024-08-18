<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Label, Button, A, Spinner } from 'flowbite-svelte';

	export let form;

	let loading = false;

	function activateLoading() {
		loading = true;

		return async ({ update }: { update: any }) => {
			await update();
			loading = false;
		};
	}
</script>

<main
	class="flex h-screen flex-col items-center justify-center bg-gradient-to-r from-green-300 to-green-600"
>
	<div class="align-center flex flex-col items-center justify-center rounded-xl bg-white">
		<div class="m-4 flex items-center justify-center">
			<img class="w-1/6" src="/images/class-connect-logo.png" alt="ClassConnect logo" />
			<h1 class="font-roboto m-4 text-4xl font-bold">ClassConnect</h1>
		</div>

		<div
			class="w-1/2 rounded-xl bg-white bg-opacity-80 p-4 dark:bg-gray-800 dark:bg-opacity-80 dark:text-gray-200"
		>
			<div class="p-2 text-center">
				<h1 class="text-center text-3xl font-bold dark:text-white">Forgot Password</h1>
				<p class="dark:text-gray-200">Enter your email to reset your password.</p>
			</div>

			{#if form?.error}
				<p class="mt-2 text-center text-red-500 dark:text-red-400">{form.error}</p>
			{/if}

			{#if form?.success}
				<p class="mt-2 text-center text-green-500 dark:text-green-400">{form.success}</p>
			{/if}

			<form method="POST" use:enhance={activateLoading}>
				<Label for="email" class="mb-2 mt-2 dark:text-gray-200">Email</Label>
				<Input
					type="email"
					id="email"
					name="email"
					placeholder="name@example.com"
					size="md"
					disabled={loading}
					required
				/>

				{#if loading}
					<Button disabled class="my-4 w-full">
						<Spinner class="me-3" size="4" color="white" data-testid="spinner" />
						Sending Reset Link
					</Button>
				{:else}
					<Button type="submit" class="my-4 w-full">Send Reset Link</Button>
				{/if}
			</form>

			<div class="p-2">
				<div class="flex justify-center">
					<A href="/signin" class="text-green-600 dark:text-green-400">Back to Sign In</A>
				</div>
			</div>
		</div>
	</div>
</main>
