<script>
	export let files;
	import FilesCard from '$lib/components/utils/lecturer/+FilesCard.svelte';
	import ObjectCard from '$lib/components/utils/lecturer/+ObjectCard.svelte';

	const stats = [
		{
			title: 'Students',
			stat: '2'
		},
		{
			title: 'Lectures today',
			stat: '1'
		},
		{
			title: 'Study Material',
			stat: files.length
		}
	];

	let study_files = []
	let object_files = []

	files.forEach(file => {
		if (file.type === 'pdf') {
			study_files.push(file)
		} else {
			object_files.push(file)
		}
	})

</script>

<div class="grid grid-cols-1 gap-5 bg-gray-100 p-2 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
	{#each stats as stat}
		<div class="flex flex-col rounded-3xl bg-white">
			<div class="px-2 py-2 sm:p-5 sm:pb-2">
				<div class="grid w-full grid-cols-1 items-center justify-center text-left">
					<div>
						<h2 class="text-lg font-medium tracking-tighter text-gray-600 lg:text-3xl">
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
	<FilesCard files={study_files} />
	<ObjectCard files={object_files} />
</div>
