<script lang="ts">
	import { Card } from 'flowbite-svelte';

	import Applications from './Applications.svelte';
	import Announcements from './Announcements.svelte';
	import UpcomingEvents from './UpcomingEvents.svelte';
	import PerformanceChart from './PerformanceChart.svelte';
</script>

<main class="w-full p-4">
	<div class="mb-4 flex gap-4">
		<Card size="lg" class="max-w-none">
			<PerformanceChart />
		</Card>

		<Card class="max-w-xl">
			<UpcomingEvents />
		</Card>
	</div>

	<div class="flex gap-4">
		<Card size="lg" class="max-w-xl flex-grow">
			<Applications />
		</Card>

		<Card size="sm" class="max-w-none flex-grow">
			<Announcements />
		</Card>
	</div>
</main>
