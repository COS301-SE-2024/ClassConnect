<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Label, Input } from 'flowbite-svelte';
	import Banner from '$lib/components/common/Banner.svelte';

	export let name;
	export let surname;
	export let email;

	let message: string = 'Hi';
	let color: string;
	let display: boolean;

	function updateDet() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				message = 'Profile details updated successfully';
				color = 'green';
				display = true;
			} else {
				console.error(result.data?.error);
				message = 'Update failed';
				color = 'red';
				display = true;
			}
		};
	}
</script>

{#if display}
	<Banner type="Delete" color={color} message={message} />
{/if}

<div
class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
>
	<h3 class="mb-4 text-xl font-semibold dark:text-white">General information</h3>
	<form method="POST" action="/settings?/update_general_details" use:enhance={updateDet}>
		<div class="grid grid-cols-6 gap-6">
			<div class="col-span-6 sm:col-span-3">
				<Label for="name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>First Name</Label
				>
				<Input
					type="text"
					name="name"
					id="name"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
					placeholder={name}
				/>
			</div>

			<div class="col-span-6 sm:col-span-3">
				<Label for="surname" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>Last Name</Label
				>
				<Input
					type="text"
					name="surname"
					id="surname"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
					placeholder={surname}
				/>
			</div>

			<div class="col-span-6 sm:col-span-3">
				<Label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>Email</Label
				>
				<Input
					type="email"
					name="email"
					id="email"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
					placeholder={email}
				/>
			</div>

			<div class="sm:col-full col-span-6">
				<Button
					class="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
					type="submit">Update</Button
				>
			</div>
		</div>
	</form>
</div>
