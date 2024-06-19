<script lang='ts'>
    import IconFiles from '@tabler/icons-svelte/IconFiles.svelte';
    import UploadStudy from '$lib/components/lecturer/modals/+UploadStudy.svelte';

    const files = [
        {
            name: 'Lecture 1',
        },
        {
            name:'Lecture 2',
        },
        {
            name:'Lecture 3',
        },
        {
            name:'Lecture 4',
        },
    ]

</script>

<div class="max-w-md rounded-xl border bg-white p-6 pb-10 text-gray-900">
  <p class="text-lg font-medium">Study Material Uploads</p>
  {#each files as file}
    <div class="mt-4 flex items-center rounded-lg bg-gray-100 py-1 px-2 text-gray-600">
      <IconFiles />
      <p class="text-sm p-2">{file.name}</p>
    </div>
  {/each}
  <div class="m-2 flex justify-center items-center">
    <UploadStudy />
  </div>
</div>
  