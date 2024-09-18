<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Label, Input } from 'flowbite-svelte';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	import toast, { Toaster } from 'svelte-french-toast';

	let currentShowPassword = false;
	let newShowPassword = false;
	let confirmShowPassword = false;

	function updatePass() {
		const toastId = toast.loading('Updating...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				toast.dismiss(toastId);
				toast.success('Profile details updated successfully');
				await update();
			} else {
				toast.dismiss(toastId);
				toast.error('Update failed: ' + result.data?.error);
			}
		};
	}
</script>

<Toaster />

<div
	class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
>
	<h3 class="mb-4 text-xl font-semibold dark:text-white">Password Information</h3>
	<form method="POST" action="/settings?/update_password" use:enhance={updatePass}>
		<div class="grid grid-cols-6 gap-6">
			<div class="col-span-6 sm:col-span-3">
				<Label
					for="currPassword"
					class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>Current Password</Label
				>
				<div class="relative">
					<Input
						type={currentShowPassword ? 'text' : 'password'}
						autocomplete="off"
						name="currPassword"
						id="currPassword"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
						placeholder="••••••••"
						required
					/>
					<button
						type="button"
						aria-label="Toggle password visibility"
						class="absolute inset-y-0 right-0 flex items-center pr-3"
						on:click={() => (currentShowPassword = !currentShowPassword)}
					>
						{#if currentShowPassword}
							<EyeSlashOutline class="text-gray-500" />
						{:else}
							<EyeOutline class="text-gray-500" />
						{/if}
					</button>
				</div>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<Label
					for="newPassword"
					class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">New Password</Label
				>
				<div class="relative">
					<Input
						type={newShowPassword ? 'text' : 'password'}
						autocomplete="off"
						name="newPassword"
						id="newPassword"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
						placeholder="••••••••"
						required
					/>
					<button
						type="button"
						aria-label="Toggle password visibility"
						class="absolute inset-y-0 right-0 flex items-center pr-3"
						on:click={() => (newShowPassword = !newShowPassword)}
					>
						{#if newShowPassword}
							<EyeSlashOutline class="text-gray-500" />
						{:else}
							<EyeOutline class="text-gray-500" />
						{/if}
					</button>
				</div>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<Label
					for="conPassword"
					class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>Confirm Password</Label
				>
				<div class="relative">
					<Input
						type={confirmShowPassword ? 'text' : 'password'}
						autocomplete="off"
						name="conPassword"
						id="conPassword"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
						placeholder="••••••••"
						required
					/>
					<button
						type="button"
						aria-label="Toggle password visibility"
						class="absolute inset-y-0 right-0 flex items-center pr-3"
						on:click={() => (confirmShowPassword = !confirmShowPassword)}
					>
						{#if confirmShowPassword}
							<EyeSlashOutline class="text-gray-500" />
						{:else}
							<EyeOutline class="text-gray-500" />
						{/if}
					</button>
				</div>
			</div>
			<div class="col-span-6">
				<Button
					type="submit"
					class="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
					>Update Password</Button
				>
			</div>
		</div>
	</form>
</div>
