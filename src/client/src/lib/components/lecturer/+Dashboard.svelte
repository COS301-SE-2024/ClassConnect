<script>
	export let files;
	import { Tabs, TabItem } from 'flowbite-svelte';
	import Overview from '$lib/components/lecturer/+Overview.svelte';
</script>

<Tabs tabStyle="underline">
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">Overview</div>
		<div>
			<Overview files={files}/>
		</div>
	</TabItem>

</Tabs>
