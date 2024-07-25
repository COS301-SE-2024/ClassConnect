<script>
	import { Button, Modal } from 'flowbite-svelte';
	import AssessmentTable from '$lib/components/common/AsessmentTable.svelte';
	import LineChart from '$lib/components/common/LineChart.svelte';

	/**
	 * @type {any[]}
	 */
	let assessments = [];
	let showModal = false;
	let newAssessmentName = '';

	function addAssessment() {
		assessments = [...assessments, { name: newAssessmentName, data: [] }];
		newAssessmentName = '';
		showModal = false;
	}

	/**
	 * @param {number} index
	 */
	function removeAssessment(index) {
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

	<Modal bind:open={showModal} size="xs">
		<div class="p-6">
			<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add New Assessment</h3>
			<input
				type="text"
				bind:value={newAssessmentName}
				placeholder="Assessment Name"
				class="mb-4 w-full rounded border p-2"
			/>
			<Button on:click={addAssessment}>Add</Button>
		</div>
	</Modal>
</main>
