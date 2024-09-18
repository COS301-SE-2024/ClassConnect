<script lang="ts">
	import {
		ArrowRightOutline,
		DotsVerticalOutline,
		EyeOutline,
		ShareNodesOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { Button, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import DeleteMaterial from '$src/lib/components/modals/materials/DeleteMaterial.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { objURL, displayedSandboxObjectURL } from '$src/lib/store/objects';
	import Preview from '$src/lib/components/modals/materials/Preview.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let title;
	export let description;
	export let thumbnail: string;
	export let id: string;
	export let url: string;
	export let type: boolean;

	let openPreviewModal = false;
	let openDeleteModal = false;

	const handleFileOpening = () => {
		if (!type) {
			objURL.set(url);
			goto($page.url + '/material');
		} else {
			displayedSandboxObjectURL.set(url);
			let curr_url: string = $page.url.toString();
			curr_url = curr_url.replace('materials', 'sandbox');
			goto(curr_url);
		}
	};

	// Emit a custom event when the delete button is clicked
	const handleDelete = () => {
		const event = new CustomEvent('delete', {
			detail: { id }
		});
		dispatchEvent(event);
	};

	onMount(() => {
		// Ensure that the subscription happens within the component's lifecycle
		const unsubscribe = page.subscribe(() => {});

		return () => {
			unsubscribe();
		};
	});

	const copyToClipboard = () => {
		try {
			navigator.clipboard.writeText(url);
			toast.success('Url copied to clipboard!');
		} catch (err) {
			toast.error('Failed to copy url to clipboard!');
		}
	};
</script>

<Toaster />

<div class="space-y-4">
	<div
		class="text-surface shadow-secondary-1 dark:bg-surface-dark block max-w-[18rem] rounded-lg bg-white dark:text-white"
	>
		<div class="relative flex justify-center overflow-hidden bg-cover bg-no-repeat">
			<img class="rounded-t-lg border" src={thumbnail} alt={title} />
		</div>
		<div class="flex items-center justify-between px-6">
			<h5 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
				{title}
			</h5>
			<div>
				<DotsVerticalOutline id="card-dot-menu" size="xl" />
				<Dropdown placement="bottom" triggeredBy="#card-dot-menu">
					<DropdownItem class="flex" on:click={copyToClipboard}>
						<ShareNodesOutline class="me-2" />
						Share
					</DropdownItem>
					<DropdownItem class="flex" on:click={() => (openPreviewModal = true)}>
						<EyeOutline class="me-2" />
						Preview
					</DropdownItem>
					<DropdownDivider />
					<DropdownItem class="flex" on:click={handleDelete}>
						<TrashBinOutline color="red" class="me-2" />
						Delete
					</DropdownItem>
				</Dropdown>
			</div>
		</div>
		<div class="px-6 py-2">
			<p class="font-normal leading-tight text-gray-700 dark:text-gray-400">
				{description}
			</p>
		</div>
		<div class="px-6 py-2">
			<Button on:click={handleFileOpening}>
				Open File <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
			</Button>
		</div>
	</div>
</div>

<Preview
	open={openPreviewModal}
	{url}
	name={title}
	type={type ? 'object' : 'material'}
	on:close={() => (openPreviewModal = false)}
/>

<DeleteMaterial
	{id}
	open={openDeleteModal}
	name={title}
	on:close={() => (openDeleteModal = false)}
/>
