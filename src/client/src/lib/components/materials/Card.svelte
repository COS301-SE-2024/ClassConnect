<script lang="ts">
	import { ArrowRightOutline, DotsVerticalOutline, EyeOutline, ShareNodesOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { Card, Button, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import DeleteMaterial from '$src/lib/components/modals/materials/DeleteMaterial.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { objURL,displayedSandboxObjectURL } from '$src/lib/store/objects';
	import Preview from '$src/lib/components/modals/materials/Preview.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let title;
	export let description;
	export let thumbnail: string;
	export let id : string;
	export let url: string;
	export let type: boolean;

	let openPreviewModal = false;
	let openDeleteModal = false;

	console.log(id);

	const handleFileOpening = () => {
		if(!type){
			objURL.set(url);
			goto($page.url+'/material');
		}else{
			displayedSandboxObjectURL.set(url);
			let curr_url : string = $page.url.toString();
			curr_url = curr_url.replace('materials','sandbox');
			goto(curr_url);
		}
	};

	const copyToClipboard = () => {
		console.log(url);
		try{
			navigator.clipboard.writeText(url);
			toast.success("Url copied to clipboard!");
		}catch(err){
			toast.error("Failed to copy url to clipboard!");
		}
	};

</script>

<Toaster />

<div  class="space-y-4">
	<Card img={thumbnail} >
		<div class="flex items-center justify-between">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{ title }
			</h5>
			<div>
				<DotsVerticalOutline id="card-dot-menu" size="xl" />
				<Dropdown placement="bottom" triggeredBy="#card-dot-menu">
					<DropdownItem class='flex' on:click={copyToClipboard}>
						<ShareNodesOutline class="me-2" />
						Share
					</DropdownItem>
					<DropdownItem class='flex' on:click={()=>openPreviewModal=true}>
						<EyeOutline class="me-2" />
						Preview
					</DropdownItem>
					<DropdownDivider />
					<DropdownItem class='flex' on:click={()=>openDeleteModal=true}>
						<TrashBinOutline color='red' class="me-2" />
						Delete
					</DropdownItem>
				</Dropdown>
			</div> 
		</div>
	  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
		{description}
	  </p>
	  <Button on:click={handleFileOpening}>
		Open File <ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
	  </Button>
	</Card>
</div>

<Preview open={openPreviewModal} url={url} name={title} type={type ? 'object' : 'material'} on:close={()=>openPreviewModal=false}/>

<DeleteMaterial id={id} open={openDeleteModal} name={title} on:close={()=>openDeleteModal=false}/>