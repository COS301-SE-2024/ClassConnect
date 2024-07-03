<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from 'flowbite-svelte';
	import AddOrg from '$lib/components/admin/modals/add/+AddOrg.svelte';
	import DeleteOrd from '$lib/components/admin/modals/remove/+RemoveOrg.svelte';

	export let data: PageData;
	$: ({ id, name, image } = data);
</script>

<div class="container mx-auto px-4 py-8">
	{#if id && name && image}
		<div class="flex flex-col items-center">
			<img src={image} alt="{name} logo" class="mb-4 h-32 w-32 rounded-full" />

			<h1 class="mb-6 text-3xl font-bold text-gray-800">{name}</h1>

			<div class="flex space-x-4">
				<Button>Update</Button>
				<DeleteOrd {id} />
			</div>
		</div>
	{:else}
		<div class="text-center">
			<h2 class="mb-4 text-2xl font-semibold text-gray-700">No Organization Found</h2>

			<AddOrg />
		</div>
	{/if}
</div>
