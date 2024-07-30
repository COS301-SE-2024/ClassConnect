<script lang="ts">
	import {
		Input,
		Chart,
		Card,
		Button,
		Dropdown,
		DropdownItem,
		Modal,
		Label
	} from 'flowbite-svelte';
	import { ChevronDownOutline, FileLinesSolid } from 'flowbite-svelte-icons';

	let formModal = false;
	export let series: Array<{ name: string; data: number[]; color: string }>;
	export let categories: string[];

	let options = {
		chart: {
			height: '400px',
			maxWidth: '100%',
			type: 'line',
			fontFamily: 'Inter, sans-serif',
			dropShadow: {
				enabled: false
			},
			toolbar: {
				show: false
			}
		},
		tooltip: {
			enabled: true,
			x: {
				show: false
			}
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			width: 6,
			curve: 'straight'
		},
		grid: {
			show: true,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: -26
			}
		},
		series: series,
		legend: {
			show: true
		},
		xaxis: {
			categories: categories,
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			},
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			}
		},
		yaxis: {
			show: true
		}
	};
</script>

<Card size="lg">
	<div class="mb-5 flex justify-between">
		<div class="grid grid-cols-2 gap-4">
			<p class="text-2xl font-bold leading-none text-gray-900 dark:text-white">
				Tutorial Test Graph
			</p>
		</div>
		<div>
			<Button color="light" class="px-3 py-2"
				>Last week<ChevronDownOutline class="ms-1.5 h-2.5 w-2.5" /></Button
			>
			<Dropdown class="w-40">
				<DropdownItem>Yesterday</DropdownItem>
				<DropdownItem>Today</DropdownItem>
				<DropdownItem>Last 7 days</DropdownItem>
				<DropdownItem>Last 30 days</DropdownItem>
				<DropdownItem>Last 90 days</DropdownItem>
			</Dropdown>
		</div>
	</div>
	<Chart {options} />
	<div
		class="mt-2.5 grid grid-cols-1 items-center justify-between border-t border-gray-200 dark:border-gray-700"
	>
		<div class="pt-5">
			<Button
				href="/"
				class="inline-flex items-center rounded-lg bg-primary-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
			>
				<FileLinesSolid class="me-2 h-3.5 w-3.5 text-white" />
				View full report
			</Button>
			<Button
				href="/"
				class="inline-flex items-center rounded-lg bg-primary-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
			>
				<FileLinesSolid class="me-2 h-3.5 w-3.5 text-white" />
				Edit existing report
			</Button>
			<Button
				on:click={() => (formModal = true)}
				class="inline-flex items-center rounded-lg bg-primary-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
			>
				<FileLinesSolid class="me-2 h-3.5 w-3.5 text-white" />
				Add new data
			</Button>
			<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
				<form class="flex flex-col space-y-6" action="#">
					<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
						Add New Tutorial Test Data
					</h3>
					{#each series as serie}
						<Label class="space-y-2">
							<span>{serie.name}</span>
							<Input type="number" name={serie.name.toLowerCase().replace(/\s+/g, '')} required />
						</Label>
					{/each}
					<Button type="submit" class="w-full1">Submit</Button>
				</form>
			</Modal>
		</div>
	</div>
</Card>
