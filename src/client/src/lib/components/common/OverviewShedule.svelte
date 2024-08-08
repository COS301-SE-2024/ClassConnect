<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	const schedule = [
		{
			time: '08:00 - 09:00',
			href: '/',
			title: 'Opening remarks'
		},
		{
			time: '09:00 - 10:00',
			href: '/',
			title: 'Bergside LLC: Controlling the video traffic flows'
		},
		{
			time: '10:00 - 11:00',
			href: '/',
			title: 'Flowbite - An Open Framework for Forensic Watermarking'
		},
		{
			time: '11:00 - 12:00',
			href: '/',
			title: 'Coffee Break'
		},
		{
			time: '12:00 - 13:00',
			href: '/',
			title: 'Scaling your brand from €0 to multimillion euros'
		}
	];
</script>

<div class="w-full">
	<div class="mb-6 flex items-center justify-between">
		<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Schedule</h5>
		<a href="/" class="text-sm font-medium text-primary-600 dark:text-primary-500">View all</a>
	</div>
	<Table divClass="overflow-x-auto w-full">
		<TableBody>
			{#each schedule as item}
				<TableBodyRow>
					<TableBodyCell>
						<div>
							<div class="text-sm text-gray-500">{item.time}</div>
							<div class="font-semibold">{item.title}</div>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
