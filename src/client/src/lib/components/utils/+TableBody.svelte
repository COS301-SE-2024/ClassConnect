<script lang='ts'>
    import EditStudent from '$lib/components/modals/+EditStudent.svelte';
	import Remove from '$lib/components/modals/+Remove.svelte';
    export let students: any [] = [];

</script>
  
<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
    {#each students as student}
    <tr>
        <td class="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700">
        <div class="inline-flex items-center gap-x-3">
            <div class="flex items-center gap-x-2">
                <img
                    class="h-10 w-10 rounded-full object-cover"
                    src={student.image}
                    alt=""
                />
            <div>
                <h2 class="font-medium text-gray-800 dark:text-white">
                {student.name} {student.surname}
                </h2>
                <p class="text-sm font-normal text-gray-600 dark:text-gray-400">
                {student.username}
                </p>
            </div>
            </div>
        </div>
        </td>
        <td class="whitespace-nowrap px-12 py-4 text-sm font-medium text-gray-700">
            {student.username}
        </td>
        <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
            {student.email}
        </td>
        <td class="whitespace-nowrap px-4 py-4 text-sm">
        <div class="flex items-center gap-x-6">
            <!-- Assuming Remove and EditStudent components are defined and imported -->
            <Remove id={student._id} />
            <EditStudent studentID={student._id} />
        </div>
        </td>
    </tr>
    {/each}
</tbody>
  
