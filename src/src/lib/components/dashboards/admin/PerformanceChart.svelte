<script lang="ts">
	import { Chart } from 'flowbite-svelte';
	import { SalePercentSolid } from 'flowbite-svelte-icons';

	const options = {
		colors: ['#50e991', '"#0bb4ff"'],
		series: [
			{
				name: 'Your Average (%)',
				color: '#50e991',
				data: [
					{ x: 'Jan', y: 42 },
					{ x: 'Feb', y: 31 },
					{ x: 'Mar', y: 89 },
					{ x: 'Apr', y: 67 },
					{ x: 'May', y: 14 },
					{ x: 'Jun', y: 53 },
					{ x: 'Jul', y: 86 }
				]
			},
			{
				name: 'Class Average (%)',
				color: '#0bb4ff',
				data: [
					{ x: 'Jan', y: 75 },
					{ x: 'Feb', y: 28 },
					{ x: 'Mar', y: 91 },
					{ x: 'Apr', y: 19 },
					{ x: 'May', y: 83 },
					{ x: 'Jun', y: 46 },
					{ x: 'Jul', y: 72 }
				]
			}
		],
		chart: {
			type: 'bar',
			height: '320px',
			fontFamily: 'Inter, sans-serif',
			toolbar: { show: false }
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '70%',
				borderRadiusApplication: 'end',
				borderRadius: 8
			}
		},
		tooltip: {
			shared: true,
			intersect: false,
			style: { fontFamily: 'Inter, sans-serif' }
		},
		states: { hover: { filter: { type: 'darken', value: 1 } } },
		stroke: { show: true, width: 0, colors: ['transparent'] },
		grid: {
			show: false,
			strokeDashArray: 4,
			padding: { left: 2, right: 2, top: -14 }
		},
		dataLabels: { enabled: false },
		legend: { show: false },
		xaxis: {
			floating: false,
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			},
			axisBorder: { show: false },
			axisTicks: { show: false }
		},
		yaxis: { show: false },
		fill: { opacity: 1 }
	};
</script>

<div class="mb-4 flex justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
	<div class="flex items-center">
		<div
			class="me-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
		>
			<SalePercentSolid class="h-6 w-6 text-gray-500 dark:text-gray-400" />
		</div>

		<div>
			<h5 class="pb-1 text-2xl font-bold leading-none text-gray-900 dark:text-white">
				Average Percentages
			</h5>
		</div>
	</div>
</div>

<Chart {options} />
