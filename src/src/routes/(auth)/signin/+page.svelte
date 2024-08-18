<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Label, Button, A, Spinner } from 'flowbite-svelte';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';

	export let form;

	let loading = false;
	let showPassword = false;

	function activateLoading() {
		loading = true;

		return async ({ update }: { update: any }) => {
			await update();
			loading = false;
		};
	}
</script>

<main class="flex">
	<section class="w-1/2" style="z-index: 1;">
		<div class="flex h-screen flex-col items-center">
			<div class="m-4 flex items-center justify-center">
				<img class="w-1/4" src="/images/class-connect-logo.png" alt="ClassConnect logo" />
				<h1 class="font-roboto m-4 text-5xl font-bold">ClassConnect</h1>
			</div>

			<div
				class="w-1/2 rounded-xl bg-white bg-opacity-80 p-4 dark:bg-gray-800 dark:bg-opacity-80 dark:text-gray-200"
			>
				<div class="p-2 text-center">
					<h1 class="text-center text-3xl font-bold dark:text-white">Welcome Back 👋</h1>
					<p class="dark:text-gray-200">Today is a new day. It's your day. You shape it.</p>
				</div>

				{#if form?.error}
					<p class="mt-2 text-center text-red-500 dark:text-red-400">{form.error}</p>
				{/if}

				<form method="POST" use:enhance={activateLoading}>
					<Label for="username" class="mb-2 mt-2 dark:text-gray-200">Username</Label>
					<Input
						type="text"
						id="username"
						name="username"
						placeholder="a12345678"
						size="md"
						disabled={loading}
						required
					/>
					<Label for="password" class="mb-2 mt-2 dark:text-gray-200">Password</Label>
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
								<EyeSlashOutline class="text-gray-500 dark:text-gray-400" />
							{:else}
								<EyeOutline class="text-gray-500 dark:text-gray-400" />
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
					<div class="flex justify-between">
						<A href="/forgot-password" class="text-green-600 dark:text-green-400">
							Forgot your password?
						</A>

						<p class="dark:text-gray-200">
							Don't have an account?{' '}
							<A href="/signup" class="text-green-600 dark:text-green-400">Sign Up</A>
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
