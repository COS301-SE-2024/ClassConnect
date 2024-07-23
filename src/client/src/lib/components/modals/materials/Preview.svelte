<script lang="ts">
	import Scene from '$src/lib/components/sandbox/+Scene.svelte';
    import { createEventDispatcher } from 'svelte';
	import { Modal } from 'flowbite-svelte';
    import { Canvas } from '@threlte/core';

    const dispatch = createEventDispatcher();
	
    export let open: boolean;
    export let url: string;
    export let type: string;
    export let name: string;

    // 3D Object Preview
	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let enableZoom: boolean = true;

    function closeModal() {
        open = false;
        dispatch('close');
    }

</script>

{#if type === 'object'}
<Modal id="previewModal" bind:open size="lg" placement="center" on:close={closeModal}>
	<div class="p-6 text-center">
		<h3 class="mb-5 text-lg font-normal text-black dark:text-gray-400">
			{name}
		</h3>
		<div class="flex justify-center p-3">
            <section
			class="flex h-[500px] w-[500px] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
		>
			<div class="flex-1">
				<Canvas>
					<Scene
						{enableDamping}
						{autoRotate}
						{rotateSpeed}
						{zoomToCursor}
						{zoomSpeed}
						{enableZoom}
					/>
				</Canvas>
			</div>
		    </section>
		</div>
	</div>
</Modal>
{/if}

{#if type === 'material'}
<Modal id="previewModal" bind:open size="lg" placement="center">
	<div class="p-6 text-center">
		<h3 class="mb-5 text-lg font-normal text-black dark:text-gray-400">
			{name}
		</h3>
		<div class="flex justify-center p-3">
            <section
			class="flex h-[500px] w-[500px] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
		>
			<div class="flex-1">
                <object id='pdf-file' class="w-full h-full flex-grow" data={url} title="Study Material" />
			</div>
		    </section>
		</div>
	</div>
</Modal>
{/if}