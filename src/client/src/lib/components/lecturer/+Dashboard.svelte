<script>
	import { Tabs, TabItem } from 'flowbite-svelte';
	import Overview from '$lib/components/lecturer/+Overview.svelte';
	
</script>

<Tabs tabStyle="underline">
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">Overview</div>
		<div>
			<Overview />
		</div>
	</TabItem>

	<TabItem>
		<div slot="title" class="flex items-center gap-2">Study Material Upload</div>
		<div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>Study Material:</b>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</div>
	</TabItem>

	<TabItem>
		<div slot="title" class="flex items-center gap-2">3D Material Upload</div>
		<div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>3D Material:</b>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</div>
	</TabItem>
</Tabs>
