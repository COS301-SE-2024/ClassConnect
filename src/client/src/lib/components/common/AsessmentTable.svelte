<script lang="ts">
	import {
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Button
	} from 'flowbite-svelte';
	import type { AssessmentStat } from '$src/types';

	interface ColumnData {
		name: string;
		submitted: number;
		average: number;
		passRate: number;
	}

	export let data: AssessmentStat[] = [];

	// function addColumn(): void {
	// 	const newColumnName = `Column ${data.length + 1}`;
	// 	data = [...data, { name: newColumnName, submitted: 0, average: 0, passRate: 0 }];
	// }

	// function removeColumn(index: number): void {
	// 	data = data.filter((_, i) => i !== index);
	// }

	// function updateData(index: number, field: keyof ColumnData, value: string): void {
	// 	if (field === 'name') {
	// 		data[index][field] = value;
	// 	} else {
	// 		data[index][field] = parseFloat(value) || 0;
	// 	}
	// 	data = [...data];
	// }

	// function handleInput(event: Event, index: number, field: keyof ColumnData): void {
	// 	const target = event.target as HTMLInputElement;
	// 	updateData(index, field, target.value);
	// }
</script>

<Table striped={true} hoverable={true}>
	<TableHead>
		<TableHeadCell>Name</TableHeadCell>
		<TableHeadCell>Submitted (%)</TableHeadCell>
		<TableHeadCell>Average (%)</TableHeadCell>
		<TableHeadCell>Pass Rate (%)</TableHeadCell>
		<TableHeadCell>Actions</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each data as column, index}
			<TableBodyRow>
				<TableBodyCell>
					<input
						type="text"
						value={column.name}
						on:input={(e) => handleInput(e, index, 'name')}
						class="w-full rounded border bg-transparent p-2"
					/>
				</TableBodyCell>
				<TableBodyCell>
					<input
						type="number"
						value={column.submitted}
						on:input={(e) => handleInput(e, index, 'submitted')}
						class="w-full rounded border bg-transparent p-2"
					/>
				</TableBodyCell>
				<TableBodyCell>
					<input
						type="number"
						value={column.average}
						on:input={(e) => handleInput(e, index, 'average')}
						class="w-full rounded border bg-transparent p-2"
					/>
				</TableBodyCell>
				<TableBodyCell>
					<input
						type="number"
						value={column.passRate}
						on:input={(e) => handleInput(e, index, 'passRate')}
						class="w-full rounded border bg-transparent p-2"
					/>
				</TableBodyCell>
				<TableBodyCell>
					<Button color="red" size="sm" on:click={() => removeColumn(index)}>Remove</Button>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Button class="mt-4" on:click={addColumn}>Add Column</Button>
