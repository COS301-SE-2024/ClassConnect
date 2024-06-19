<script>
    import FilesCard from '$lib/components/utils/lecturer/+FilesCard.svelte';
    import ObjectCard from '$lib/components/utils/lecturer/+ObjectCard.svelte';

    const stats = [
        {
            title: 'Students',
            stat: '20',
        },
        {
            title: 'Lectures today',
            stat: '3',
        },
        {
            title: 'Study Material',
            stat: '4',
        },
    ]

</script>


<div class="grid grid-cols-1 gap-5 bg-gray-100 p-2 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
    {#each stats as stat }
        <div class="flex flex-col bg-white rounded-3xl">
            <div class="px-2 py-2 sm:p-5 sm:pb-2">
            <div class="grid items-center justify-center w-full grid-cols-1 text-left">
                <div>
                <h2
                    class="text-lg font-medium tracking-tighter text-gray-600 lg:text-3xl"
                >
                    {stat.title}
                </h2>
                </div>
                <div class="mt-6">
                <p>
                    <span class="text-5xl font-light tracking-tight text-black">
                        {stat.stat}
                    </span>
                </p>
                </div>
            </div>
            </div>
        </div>
    {/each}
</div>
  

<div class="grid grid-cols-1 gap-3 bg-gray-100 p-2 sm:grid-cols-1 sm:p-10 lg:grid-cols-2">
    <FilesCard />
    <ObjectCard /> 
</div>
