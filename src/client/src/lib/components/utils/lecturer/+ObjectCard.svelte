<script lang='ts'>
    import IconCube from '@tabler/icons-svelte/IconCube.svelte';
    import UploadObject from '$lib/components/lecturer/modals/+UploadObject.svelte';

    const files = [
        {
            name: 'Object 1',
        },
        {
            name:'Object 2',
        },
        {
            name:'Object 3',
        },
        {
            name:'Object 4',
        },
    ]

</script>

<div class="max-w-md rounded-xl border bg-white p-6 pb-10 text-gray-900">
  <p class="text-lg font-medium">Object Uploads</p>
  {#each files as file}
    <div class="mt-4 flex items-center rounded-lg bg-gray-100 py-1 px-2 text-gray-600">
      <IconCube />
      <p class="text-sm p-2">{file.name}</p>
    </div>
  {/each}
  <div class="m-2 flex justify-center items-center">
    <UploadObject />
  </div>
</div>