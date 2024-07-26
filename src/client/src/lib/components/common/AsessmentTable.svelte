<script lang="ts">
	import { Table, Button } from 'flowbite-svelte';

	interface ColumnData {
		name: string;
		submitted: number;
		average: number;
		passRate: number;
	}

	export let data: ColumnData[] = [];

	function addColumn(): void {
		const newColumnName = `Column ${data.length + 1}`;
		data = [...data, { name: newColumnName, submitted: 0, average: 0, passRate: 0 }];
	}

	function removeColumn(index: number): void {
		data = data.filter((_, i) => i !== index);
	}

	function updateData(index: number, field: keyof ColumnData, value: string): void {
		if (field === 'name') {
			data[index][field] = value;
		} else {
			data[index][field] = parseFloat(value) || 0;
		}
		data = [...data];
	}

	function handleInput(event: Event, index: number, field: keyof ColumnData): void {
		const target = event.target as HTMLInputElement;
		updateData(index, field, target.value);
	}
</script>

<Table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Submitted (%)</th>
			<th>Average (%)</th>
			<th>Pass Rate (%)</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each data as column, index}
			<tr>
				<td>
					<input
						type="text"
						value={column.name}
						on:input={(e) => handleInput(e, index, 'name')}
						class="w-full rounded border p-2"
					/>
				</td>
				<td>
					<input
						type="number"
						value={column.submitted}
						on:input={(e) => handleInput(e, index, 'submitted')}
						class="w-full rounded border p-2"
					/>
				</td>
				<td>
					<input
						type="number"
						value={column.average}
						on:input={(e) => handleInput(e, index, 'average')}
						class="w-full rounded border p-2"
					/>
				</td>
				<td>
					<input
						type="number"
						value={column.passRate}
						on:input={(e) => handleInput(e, index, 'passRate')}
						class="w-full rounded border p-2"
					/>
				</td>
				<td>
					<Button color="red" on:click={() => removeColumn(index)}>Remove</Button>
				</td>
			</tr>
		{/each}
	</tbody>
</Table>

<Button on:click={addColumn}>Add Column</Button>
