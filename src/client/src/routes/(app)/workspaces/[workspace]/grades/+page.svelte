<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import AssessmentTable from '$lib/components/common/AsessmentTable.svelte';
	import LineChart from '$lib/components/common/LineChart.svelte';

	let assessments: any[] = [];
	let showModal = false;
	let newAssessmentName = '';

	function addAssessment() {
		assessments = [...assessments, { name: newAssessmentName, data: [] }];
		newAssessmentName = '';
		showModal = false;
	}

	function removeAssessment(index: number) {
		assessments = assessments.filter((_, i) => i !== index);
	}
</script>

<main class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold">Lecturer Grading System</h1>

	<Button on:click={() => (showModal = true)}>Add Assessment</Button>

	{#each assessments as assessment, index}
		<div class="mt-8">
			<h2 class="mb-2 text-2xl font-bold">{assessment.name}</h2>
			<Button color="red" on:click={() => removeAssessment(index)}>Remove Assessment</Button>
			<AssessmentTable bind:data={assessment.data} />
			<LineChart data={assessment.data} />
		</div>
	{/each}

	<Modal bind:open={showModal} size="xs" autoclose={false} class="w-full">
		<div>
			<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
				Add New Assessment Type
			</h3>
			<input
				type="text"
				bind:value={newAssessmentName}
				placeholder="Assessment Type"
				class="mb-4 w-full rounded border"
			/>
			<Button on:click={addAssessment} class="w-full">Add</Button>
		</div>
	</Modal>
</main>
