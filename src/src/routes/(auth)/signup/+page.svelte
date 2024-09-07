<script lang="ts">
	import { enhance } from '$app/forms';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	import { Input, Label, Button, A, Spinner, Helper } from 'flowbite-svelte';

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

<main class="flex min-h-screen flex-col bg-gray-100 md:flex-row">
	<section class="flex w-full items-center justify-center p-4 md:w-1/2 md:p-8">
		<div class="w-full max-w-md space-y-8">
			<div class="flex flex-col items-center justify-center">
				<img class="w-24 md:w-32" src="/images/class-connect-logo.png" alt="ClassConnect logo" />
				<h1 class="font-roboto mt-4 text-center text-3xl font-bold md:text-4xl">ClassConnect</h1>
			</div>

			<div class="rounded-xl bg-white p-6 shadow-md md:p-8">
				<h2 class="mb-6 text-center text-2xl font-bold">Get Started Now</h2>

				{#if form?.error}
					<p class="mt-2 text-center text-red-500">{form.error}</p>
				{/if}

				<form method="POST" use:enhance={activateLoading} class="space-y-4">
					<div>
						<Label for="name" class="mb-2 block">Name</Label>
						<Input
							type="text"
							id="name"
							name="name"
							placeholder="John"
							size="md"
							disabled={loading}
							required
						/>
					</div>

					<div>
						<Label for="surname" class="mb-2 block">Surname</Label>
						<Input
							type="text"
							id="surname"
							name="surname"
							placeholder="Doe"
							size="md"
							disabled={loading}
							required
						/>
					</div>

					<div>
						<Label for="email" class="mb-2 block">Email</Label>
						<Input
							type="email"
							id="email"
							name="email"
							placeholder="john.doe@company.com"
							disabled={loading}
							required
						/>
					</div>

					<div>
						<Label for="password" class="mb-2 block">Password</Label>
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
						<Helper>
							Must contain at least 6 characters, lowercase, uppercase, number, and special
							character
						</Helper>
					</div>

					<div>
						<Label for="confirm-password" class="mb-2 block">Confirm Password</Label>
						<Input
							type="password"
							id="confirm-password"
							name="confirm-password"
							placeholder="•••••••••"
							disabled={loading}
							required
						/>
					</div>

					<Button type="submit" class="w-full">
						{#if loading}
							<Spinner class="mr-3" size="4" color="white" data-testid="spinner" />
						{/if}
						Sign Up
					</Button>
				</form>

				<div class="mt-4 text-center">
					<p>
						Already have an account?
						<A href="/signin" class="text-green-600 hover:underline">Sign In</A>
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="hidden bg-green-50 md:block md:w-1/2">
		<div class="flex h-full items-center justify-center p-4">
			<img
				alt="Bookcase"
				src="/images/bookcase.jpg"
				class="h-full w-full rounded-xl object-cover shadow-lg"
			/>
		</div>
	</section>
</main>
