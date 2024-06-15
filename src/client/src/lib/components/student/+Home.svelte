<script lang='ts'>
    export let modules;
    
    import { Card, Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import randomImage from '$lib/images/random-image.avif';

</script>
  
<div class="p-4">
    <h1 class="text-2xl font-bold">University of Pretoria</h1>
    <p class="text-lg font-semibold">Computer Science</p>
    <div class="mt-2">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each modules as module}
            <Card 
                img={randomImage}
            >
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{module.module_name}</h5>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">{module.module_code}</p>
                <a href="/student/module">
                    <Button>
                        Open<ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
                    </Button>
                </a>
            </Card>
            {/each}
        </div>
    </div>    
</div>
