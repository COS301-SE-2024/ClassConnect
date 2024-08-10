<script lang="ts">
	import { Chart } from 'flowbite-svelte';

	import type { AssessmentStat } from '$src/types';

	export let data: AssessmentStat[] = [];

	$: options = {
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
		series: [
			{
				name: 'Class Submitted (%)',
				data: data.map((item) => item.submitted),
				color: '#E74C3C'
			},
			{
				name: 'Class Average (%)',
				data: data.map((item) => item.average),
				color: '#1ABC9C'
			},
			{
				name: 'Pass Rate (%)',
				data: data.map((item) => item.passRate),
				color: '#F1C40F'
			}
		],
		legend: {
			show: true
		},
		xaxis: {
			categories: data.map((item) => item.name),
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

<div class="dark:bg-gray-800 p-4 rounded">
    <Chart {options} />
</div>
