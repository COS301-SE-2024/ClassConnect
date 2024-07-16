<script>
	import {
		Table,
		Button,
		Avatar,
		TableBody,
		TableHead,
		TableBodyRow,
		TableHeadCell,
		TableBodyCell
	} from 'flowbite-svelte';
    import { onMount } from 'svelte';
	import { UserAddOutline, EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';

    let quizzes = [];
	onMount(() => {
		quizzes = [
			{ id: 1, title: 'Quiz 1', graded: true, dateModified: new Date('2023-07-01') },
			{ id: 2, title: 'Quiz 2', graded: false, dateModified: new Date('2023-07-10') },
			{ id: 3, title: 'Quiz 3', graded: true, dateModified: new Date('2023-07-15') }
		];
	});

	const headers = ['Title', 'Graded', 'Date Modified', 'Actions'];

	function handleEditModalOpen(quizId) {
		// Open edit modal logic here
		console.log(`Edit quiz with ID: ${quizId}`);
	}

	function handleRemoveModalOpen(quizId) {
		// Open remove modal logic here
		console.log(`Remove quiz with ID: ${quizId}`);
	}
</script>
