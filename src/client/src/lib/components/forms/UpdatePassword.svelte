<script lang="ts">
    import { enhance } from '$app/forms';
	import { Button, Label, Input, Banner } from 'flowbite-svelte';
    import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';

    let message: string;
    let color: string
    let display: boolean;

	let currentShowPassword = false;
	let newShowPassword = false;
	let confirmShowPassword = false;

    function updatePass() {
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
<h3 class="mb-4 text-xl font-semibold dark:text-white">Password information</h3>
<form method="POST" action="/settings?/update_password" use:enhance={updatePass}>
    <div class="grid grid-cols-6 gap-6">
        <div class="col-span-6 sm:col-span-3">
            <Label
                for="currPassword"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Current password</Label
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
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >New password</Label
            >
            <div class="relative">
                <Input
                    data-popover-target="popover-password"
                    autocomplete="off"
                    data-popover-placement="bottom"
                    type={newShowPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
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
                >Confirm password</Label
            >
            <div class="relative">
                <Input
                    type={confirmShowPassword ? 'text' : 'password'}
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
        <div class="sm:col-full col-span-6">
            <Button
                class="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                type="submit">Update password</Button
            >
        </div>
    </div>
</form>
</div>