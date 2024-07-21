<script lang="ts">
	import { objURL,displayedSandboxObjectURL} from '$src/lib/store/objects';
	import { Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let title;
	export let description;
	export let thumbnail: string;
	export let id : string;
	export let url: string;
	export let type: boolean;

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
</script>

<div  class="space-y-4">
	<Card img={thumbnail} >
	  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
		{ title }
	  </h5>
	  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
		{description}
	  </p>
	  <Button on:click={handleFileOpening}>
		Open File <ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
	  </Button>
	</Card>
</div>
