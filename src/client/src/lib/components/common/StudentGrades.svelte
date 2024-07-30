<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { Input } from 'flowbite-svelte';

  // Sample data (replace with your actual data)
  let assessments = ['Midterm', 'Final Exam', 'Project'];
  let students = [
    { name: 'Alice', grades: [85, 92, 78] },
    { name: 'Bob', grades: [72, 68, 95] },
    { name: 'Charlie', grades: [90, 88, 8] },
    // Add more students...
  ];

  let searchTerm = '';

  $: filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function getColorClass(grade: number) {
    if (grade < 60) return 'bg-red-300';
    if (grade < 80) return 'bg-yellow-200';
    return 'bg-green-200';
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Grade Book</h1>

  <Input type="text" placeholder="Search by student name" bind:value={searchTerm} class="mb-4" />

  <Table striped={true}>
    <TableHead>
      <TableHeadCell>Student Name</TableHeadCell>
      {#each assessments as assessment}
        <TableHeadCell>{assessment}</TableHeadCell>
      {/each}
    </TableHead>
    <TableBody>
      {#each filteredStudents as student}
        <TableBodyRow>
          <TableBodyCell>{student.name}</TableBodyCell>
          {#each student.grades as grade}
            <TableBodyCell class={getColorClass(grade)}>
              {grade}%
            </TableBodyCell>
          {/each}
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</div>