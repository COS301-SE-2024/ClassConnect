<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { Input, Label, Button, Spinner } from 'flowbite-svelte';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';

	export let form;

	const token = $page.params.token;

	let loading = false;
	let successful = false;
	let showPassword = false;

	function activateLoading() {
		loading = true;

		return async ({ result, update }: { update: any }) => {
			await update();

			loading = false;

			if (result.type === 'success') successful = true;
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

		{#if successful}
			<div class="w-1/2 rounded-xl bg-white bg-opacity-80 p-4">
				<div class="p-2 text-center">
					<h1 class="text-center text-3xl font-bold">Password Reset</h1>

					<p>Your password has been reset successfully.</p>

					<Button href="/signin" class="mt-4">Go back to Sign In</Button>
				</div>
			</div>
		{:else}
			<div class="w-1/2 rounded-xl bg-white bg-opacity-80 p-4">
				<div class="p-2 text-center">
					<h1 class="text-center text-3xl font-bold">Reset Password</h1>
					<p>Enter your new password below.</p>
				</div>

				{#if form?.error}
					<p class="mt-2 text-center text-red-500">{form.error}</p>
				{/if}

				<form method="POST" use:enhance={activateLoading}>
					<input type="hidden" name="token" value={token} />

					<Label for="password" class="mb-2 mt-2">New Password</Label>
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

					<Label for="confirmPassword" class="mb-2 mt-2">Confirm New Password</Label>
					<div class="relative">
						<Input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							placeholder="•••••••••"
							disabled={loading}
							required
						/>
					</div>

					{#if loading}
						<Button disabled class="my-4 w-full">
							<Spinner class="me-3" size="4" color="white" data-testid="spinner" />
							Resetting Password
						</Button>
					{:else}
						<Button type="submit" class="my-4 w-full">Reset Password</Button>
					{/if}
				</form>
			</div>
		{/if}
	</div>
</main>
