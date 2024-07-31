<script lang="ts">
	import { TabItem, Button, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { objURL, displayedSandboxObjectURL } from '$src/lib/store/objects';
	import UploadMaterial from '$lib/components/modals/materials/UploadMaterial.svelte';
	import {
		ArrowUpFromBracketOutline,
		ArrowRightOutline,
		DotsVerticalOutline,
		EyeOutline,
		ShareNodesOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import DeleteMaterial from '$src/lib/components/modals/materials/DeleteMaterial.svelte';
	import Preview from '$src/lib/components/modals/materials/Preview.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let openPreviewModal = false;
	let openDeleteModal = false;

	export let tabName: any;
	export let tabBoolean: boolean;
	export let renderedMaterials: any[] = [];

	let id: string;
	let title: string;
	let url: string;
	let type: boolean;

	let materialSearchTerm = '';
	let filteredItems = renderedMaterials;

	$: filteredItems = renderedMaterials.filter(
		(material: any) =>
			material.title.toLowerCase().includes(materialSearchTerm.toLowerCase()) ||
			material.description.toLowerCase().includes(materialSearchTerm.toLowerCase())
	);

	console.log(renderedMaterials);

	let uploadModal = false;

	const handleFileOpening = (url: string, type: boolean) => {
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

	const handleDelete = (mat_id: string, mat_title: string) => {
		id = mat_id;
		title = mat_title;
		openDeleteModal = true;
	};

	const handlePreview = (mat_url: string, mat_title: string, mat_type: boolean) => {
		console.log(mat_url);
		url = mat_url;
		displayedSandboxObjectURL.set(url);
		title = mat_title;
		type = mat_type;
		openPreviewModal = true;
	};

	const copyToClipboard = (url: string) => {
		console.log(url);
		try {
			navigator.clipboard.writeText(url);
			toast.success('Url copied to clipboard!');
		} catch (err) {
			toast.error('Failed to copy url to clipboard!');
		}
	};
</script>

<Toaster />

<TabItem open={tabBoolean}>
	<span slot="title">{tabName}</span>
	<div class="mt-4 flex items-center justify-between space-x-2">
		<div class="max-w-lg">
			<!-- SearchBox -->
			<div class="relative">
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-3.5">
						<svg
							class="size-4 flex-shrink-0 text-gray-400 dark:text-white/60"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.3-4.3"></path>
						</svg>
					</div>
					<input
						bind:value={materialSearchTerm}
						class="block w-full rounded-lg border-gray-200 py-3 pe-4 ps-10 text-lg focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
						type="text"
						placeholder="Search"
						data-hs-combo-box-input=""
					/>
				</div>
			</div>
			<!-- End SearchBox -->
		</div>
		<Button on:click={() => (uploadModal = true)} class="flex items-center space-x-1">
			<ArrowUpFromBracketOutline class="h-5 w-5" />
			<span>Upload File</span>
		</Button>
	</div>

	{#if filteredItems && filteredItems.length > 0}
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredItems as material (material.id)}
				<div class="space-y-4">
					<div
						class="text-surface shadow-secondary-1 dark:bg-surface-dark block max-w-[18rem] rounded-lg bg-white dark:text-white"
					>
						<div class="relative overflow-hidden bg-cover bg-no-repeat">
							<img class="rounded-t-lg" src={material.thumbnail} alt={material.title} />
						</div>
						<div class="flex items-center justify-between px-6">
							<h5 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
								{material.title}
							</h5>
							<div>
								<DotsVerticalOutline id="card-dot-menu-{material.id}" size="xl" />
								<Dropdown placement="bottom" triggeredBy={`#card-dot-menu-${material.id}`}>
									<DropdownItem class="flex" on:click={() => copyToClipboard(material.file_path)}>
										<ShareNodesOutline class="me-2" />
										Share
									</DropdownItem>
									<DropdownItem
										class="flex"
										on:click={() =>
											handlePreview(material.file_path, material.title, material.type)}
									>
										<EyeOutline class="me-2" />
										Preview
									</DropdownItem>
									<DropdownDivider />
									<DropdownItem
										class="flex"
										on:click={() => handleDelete(material.id, material.title)}
									>
										<TrashBinOutline color="red" class="me-2" />
										Delete
									</DropdownItem>
								</Dropdown>
							</div>
						</div>
						<div class="px-6 py-2">
							<p class="font-normal leading-tight text-gray-700 dark:text-gray-400">
								{material.description}
							</p>
						</div>
						<div class="px-6 py-2">
							<Button on:click={() => handleFileOpening(material.url, material.type)}>
								Open File <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="mt-4 text-center text-gray-600 dark:text-white">There are no materials available</p>
	{/if}
</TabItem>

<!-- Upload modal -->
<UploadMaterial open={uploadModal} on:close={() => (uploadModal = false)} />

<!-- Preview modal -->
<Preview
	bind:open={openPreviewModal}
	{url}
	name={title}
	type={type ? 'object' : 'material'}
	on:close={() => (openPreviewModal = false)}
/>

<!-- Delete modal -->
<DeleteMaterial
	{id}
	bind:open={openDeleteModal}
	name={title}
	on:close={() => (openDeleteModal = false)}
/>
