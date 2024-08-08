<script lang="ts">
	import {
		Card,
		Chart,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Timeline,
		TimelineItem,
		Badge
	} from 'flowbite-svelte';
	import { CalendarWeekSolid, SalePercentSolid } from 'flowbite-svelte-icons';

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
			toolbar: {
				show: false
			}
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
			style: {
				fontFamily: 'Inter, sans-serif'
			}
		},
		states: {
			hover: {
				filter: {
					type: 'darken',
					value: 1
				}
			}
		},
		stroke: {
			show: true,
			width: 0,
			colors: ['transparent']
		},
		grid: {
			show: false,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: -14
			}
		},
		dataLabels: {
			enabled: false
		},
		legend: {
			show: false
		},
		xaxis: {
			floating: false,
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
			show: false
		},
		fill: {
			opacity: 1
		}
	};

	type Status = 'To Do' | 'In Progress' | 'Completed' | 'Upcoming' | 'Late';
	type BadgeColor =
		| 'none'
		| 'red'
		| 'yellow'
		| 'green'
		| 'indigo'
		| 'purple'
		| 'pink'
		| 'blue'
		| 'dark'
		| 'primary';

	interface Assignment {
		image: string;
		name: string;
		date: string;
		grade: number | null;
		status: Status;
		color: BadgeColor;
	}

	const assignments: Assignment[] = [
		{
			image:
				'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720396800&semt=sph',
			name: 'Math Assignment',
			date: 'Due: May 20, 2024',
			grade: 85,
			status: 'Completed',
			color: getStatusColor('Completed')
		},
		{
			image:
				'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720396800&semt=sph',
			name: 'History Essay',
			date: 'Due: May 21, 2024',
			grade: 92,
			status: 'Completed',
			color: getStatusColor('Completed')
		},
		{
			image:
				'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720396800&semt=sph',
			name: 'Science Project',
			date: 'Due: May 22, 2024',
			grade: null,
			status: 'In Progress',
			color: getStatusColor('In Progress')
		},
		{
			image:
				'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720396800&semt=sph',
			name: 'English Literature',
			date: 'Due: May 23, 2024',
			grade: null,
			status: 'To Do',
			color: getStatusColor('To Do')
		}
	];

	function getStatusColor(status: Status): BadgeColor {
		switch (status) {
			case 'To Do':
				return 'red';
			case 'In Progress':
				return 'yellow';
			case 'Completed':
				return 'green';
			default:
				return 'none';
		}
	}
</script>

<div class="w-full p-4">
	<div class="mb-4 flex gap-4">
		<Card size="lg" class="flex-grow">
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
		</Card>
		<Card size="sm" class="flex-grow">
			<div class="mb-4 flex justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
				<div class="flex items-center">
					<div
						class="me-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
					>
						<CalendarWeekSolid class="h-6 w-6 text-gray-500 dark:text-gray-400" />
					</div>
					<div>
						<h5 class="pb-1 text-2xl font-bold leading-none text-gray-900 dark:text-white">
							Schedule
						</h5>
					</div>
				</div>
			</div>
			<Timeline order="vertical">
				<TimelineItem title="Flowbite Application UI v2.0.0" date="Released on January 13th, 2022">
					<svelte:fragment slot="icon">
						<span
							class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-200 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-900"
						>
							<CalendarWeekSolid class="h-4 w-4 text-primary-600 dark:text-primary-400" />
						</span>
					</svelte:fragment>
					<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</p>
				</TimelineItem>
				<TimelineItem title="Flowbite Figma v1.3.0" date="Released on December 7th, 2021">
					<svelte:fragment slot="icon">
						<span
							class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-200 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-900"
						>
							<CalendarWeekSolid class="h-4 w-4 text-primary-600 dark:text-primary-400" />
						</span>
					</svelte:fragment>
					<p class="text-base font-normal text-gray-500 dark:text-gray-400">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</p>
				</TimelineItem>
				<TimelineItem title="Flowbite Library v1.2.2" date="Released on December 2nd, 2021">
					<svelte:fragment slot="icon">
						<span
							class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-200 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-900"
						>
							<CalendarWeekSolid class="h-4 w-4 text-primary-600 dark:text-primary-400" />
						</span>
					</svelte:fragment>
					<p class="text-base font-normal text-gray-500 dark:text-gray-400">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</p>
				</TimelineItem>
			</Timeline>
		</Card>
	</div>

	<div class="flex gap-4">
		<Card size="lg" class="flex-grow">
			<div class="mb-4 flex items-center justify-between">
				<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
					Your Assignments
				</h5>
				<a href="/" class="text-sm font-medium text-primary-600 dark:text-primary-500">View all</a>
			</div>
			<Table divClass="relative overflow-x-auto">
				<TableBody>
					{#each assignments as assignment}
						<TableBodyRow>
							<TableBodyCell class="flex items-center">
								<img src={assignment.image} alt="" class="mr-4 h-10 w-10 rounded-full" />
								<div>
									<div class="font-semibold">{assignment.name}</div>
									<div class="text-sm text-gray-500">{assignment.date}</div>
								</div>
							</TableBodyCell>
							<TableBodyCell>
								{#if assignment.grade !== null}
									<div class="font-bold">{assignment.grade}%</div>
									<div class="text-sm text-gray-500">Your grade</div>
								{:else}
									<div class="text-sm text-gray-500">N/A</div>
								{/if}
							</TableBodyCell>
							<TableBodyCell class="text-right">
								<Badge rounded large color={assignment.color}>{assignment.status}</Badge>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</Card>
		<Card size="sm" class="flex-grow">
			<div class="mb-4 flex justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
				<div class="flex items-center">
					<div
						class="me-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
					>
						<CalendarWeekSolid class="h-6 w-6 text-gray-500 dark:text-gray-400" />
					</div>
					<div>
						<h5 class="pb-1 text-2xl font-bold leading-none text-gray-900 dark:text-white">
							Another Card
						</h5>
					</div>
				</div>
			</div>
			<p>Content goes here.</p>
		</Card>
	</div>
</div>
