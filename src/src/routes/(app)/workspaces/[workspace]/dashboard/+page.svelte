<script lang="ts">
	import {
		Card,
		Chart,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Badge
	} from 'flowbite-svelte';

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

	interface Submissions {
		image: string;
		name: string;
		date: string;
		grade: number | null;
		status: Status;
		color: BadgeColor;
	}

	const assignments: Submissions[] = [
		{
			image:
				'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720396800&semt=sph',
			name: '	Sthe Nyandeni',
			date: 'Submitted: May 20, 2024',
			grade: 92,
			status: 'Completed',
			color: getStatusColor('Completed')
		},
		{
			image:
				'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720396800&semt=sph',
			name: 'Jason Maritz',
			date: 'Submitted: May 21, 2024',
			grade: 92,
			status: 'Completed',
			color: getStatusColor('Completed')
		},
		{
			image:
				'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720396800&semt=sph',
			name: 'Jake Mileham',
			date: 'Submitted: May 22, 2024',
			grade: null,
			status: 'In Progress',
			color: getStatusColor('In Progress')
		},
		{
			image:
				'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720396800&semt=sph',
			name: 'Joshua Wereley',
			date: 'Submitted: May 23, 2024',
			grade: null,
			status: 'In Progress',
			color: getStatusColor('In Progress')
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

<div class="mt-24 w-full p-4">
	<div class="mb-4 flex gap-4">
		<Card size="none" class="flex-grow">
			<div class="mb-6 flex items-center justify-between">
				<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
					Average Percentages
				</h5>
				<a href="/" class="text-sm font-medium text-primary-600 dark:text-primary-500">View All</a>
			</div>
			<Chart {options} />
		</Card>
		<Card size="sm" class="flex-grow">
			<div class="mb-6 flex items-center justify-between">
				<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Schedule</h5>
				<a href="/" class="text-sm font-medium text-primary-600 dark:text-primary-500">View All</a>
			</div>
			<Table divClass="overflow-x-auto w-full">
				<TableBody>
					<TableBodyRow>
						<TableBodyCell>
							<div>
								<div class="text-sm text-gray-500">12 August - 13:00</div>
								<div class="font-semibold">COS301 Lecture 1</div>
							</div>
						</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>
							<div>
								<div class="text-sm text-gray-500">12 August - 16:00</div>
								<div class="font-semibold">COS301 Lecture 2</div>
							</div>
						</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>
							<div>
								<div class="text-sm text-gray-500">13 August - 08:00</div>
								<div class="font-semibold">COS301 Practical 1</div>
							</div>
						</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>
							<div>
								<div class="text-sm text-gray-500">13 August - 16:00</div>
								<div class="font-semibold">COS301 Lecture 3</div>
							</div>
						</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>
							<div>
								<div class="text-sm text-gray-500">14 August - 10:00</div>
								<div class="font-semibold">COS301 Lecture 4</div>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				</TableBody>
			</Table>
		</Card>
	</div>

	<div class="flex gap-4">
		<Card size="none" class="flex-grow">
			<div class="mb-6 flex items-center justify-between">
				<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
					Recent Submissions
				</h5>
				<a href="/" class="text-sm font-medium text-primary-600 dark:text-primary-500">View All</a>
			</div>
			<Table divClass="relative overflow-x-auto">
				<TableBody>
					{#each assignments as Submissions}
						<TableBodyRow>
							<TableBodyCell class="flex items-center">
								<img src={Submissions.image} alt="" class="mr-4 h-10 w-10 rounded-full" />
								<div>
									<div class="font-semibold">{Submissions.name}</div>
									<div class="text-sm text-gray-500">{Submissions.date}</div>
								</div>
							</TableBodyCell>
							<TableBodyCell>
								{#if Submissions.grade !== null}
									<div class="font-bold">{Submissions.grade}%</div>
								{:else}
									<div class="font-bold text-gray-400">N/A</div>
								{/if}
							</TableBodyCell>
							<TableBodyCell class="text-right">
								<Badge rounded large color={Submissions.color}>{Submissions.status}</Badge>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</Card>
		<Card size="sm" class="flex-grow">
			<div class="mb-6 flex items-center justify-between">
				<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Announcements</h5>
				<a href="/" class="text-sm font-medium text-primary-600 dark:text-primary-500">View All</a>
			</div>
			<Table divClass="overflow-x-auto w-full">
				<TableBody>
					<TableBodyRow>
						<TableBodyCell>
							<div>
								<div class="text-sm text-gray-500">12 August</div>
								<div class="font-semibold">Demo 3 Preperations</div>
							</div>
						</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>
							<div>
								<div class="text-sm text-gray-500">11 August</div>
								<div class="font-semibold">Setup links for Demo 3 Preperations</div>
							</div>
						</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>
							<div>
								<div class="text-sm text-gray-500">10 August</div>
								<div class="font-semibold">Speak to clients for Demo 3</div>
							</div>
						</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>
							<div>
								<div class="text-sm text-gray-500">10 August</div>
								<div class="font-semibold">Speak to clients for Demo 3</div>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				</TableBody>
			</Table>
		</Card>
	</div>
</div>
