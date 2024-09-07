<script lang="ts">
	import { onMount } from 'svelte';
	import {
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Button,
		ButtonGroup,
		ImagePlaceholder,
		Modal
	} from 'flowbite-svelte';
	import { ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import CancelModal from '$src/lib/components/modals/lessons/Cancel.svelte';

	export let role: string;
	export let lessons: any[];

	let divClass = 'bg-zinc-200 dark:bg-gray-900 relative shadow-md sm:rounded-lg overflow-hidden';
	let innerDivClass =
		'flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
	let searchClass = 'w-full md:w-1/2 relative';
	let classInput =
		'text-gray-800 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 pl-10';

	let searchTerm = '';
	let currentPosition = 0;
	const itemsPerPage = 10;
	const showPage = 5;
	let totalPages = 0;
	let pagesToShow: number[] = [];
	let totalItems = lessons.length;
	let startPage: number;
	let endPage: number;

	let id: string;
	let isCancelModalOpen = false;
	const headers = ['Topic', 'Date', 'Time', 'Actions'];

	const updateDataAndPagination = () => {
		const currentPageItems = lessons.slice(currentPosition, currentPosition + itemsPerPage);
		renderPagination(currentPageItems.length);
	};

	const loadNextPage = () => {
		if (currentPosition + itemsPerPage < lessons.length) {
			currentPosition += itemsPerPage;
			updateDataAndPagination();
		}
	};

	const loadPreviousPage = () => {
		if (currentPosition - itemsPerPage >= 0) {
			currentPosition -= itemsPerPage;
			updateDataAndPagination();
		}
	};

	const renderPagination = (totalItems: number) => {
		totalPages = Math.ceil(totalItems / itemsPerPage);
		const currentPage = Math.ceil((currentPosition + 1) / itemsPerPage);

		startPage = currentPage - Math.floor(showPage / 2);
		startPage = Math.max(1, startPage);
		endPage = Math.min(startPage + showPage - 1, totalPages);

		pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
	};

	const goToPage = (pageNumber: number) => {
		currentPosition = (pageNumber - 1) * itemsPerPage;
		updateDataAndPagination();
	};

	$: startRange = currentPosition + 1;
	$: endRange = Math.min(currentPosition + itemsPerPage, totalItems);

	onMount(() => {
		renderPagination(lessons.length);
	});

	$: currentPageItems = lessons.slice(currentPosition, currentPosition + itemsPerPage);
	$: filteredItems = lessons.filter(
		(lesson) => lesson.topic.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);

	let openRow: any;
	let details: any;
	let doubleClickModal = false;

	const toggleRow = (id: number) => {
		openRow = openRow === id ? null : id;
	};
</script>

<TableSearch
	placeholder="Search by topic"
	hoverable={true}
	bind:inputValue={searchTerm}
	{divClass}
	{innerDivClass}
	{searchClass}
	{classInput}
>
	<TableHead>
		{#each headers as header}
			<TableHeadCell padding="px-4 py-3">{header}</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#if searchTerm !== ''}
			{#each filteredItems as lesson (lesson.id)}
				<TableBodyRow on:click={() => toggleRow(lesson.id)} class="bg-white dark:bg-gray-900">
					<TableBodyCell tdClass="px-4 py-3">{lesson.topic}</TableBodyCell>
					<TableBodyCell tdClass="px-4 py-3">{lesson.date}</TableBodyCell>
					<TableBodyCell tdClass="px-4 py-3">{lesson.time}</TableBodyCell>
					<TableBodyCell tdClass="px-4 py-3">
						<Button
							class="mr-2"
							size="sm"
							on:click={(event) => {
								event.stopPropagation();
								goto($page.url + '/' + lesson.id);
							}}
						>
							{lesson.isInSession ? 'Join' : 'View'}
						</Button>
						{#if role === 'lecturer'}
							<Button
								size="sm"
								color="red"
								on:click={(event) => {
									event.stopPropagation();
									id = lesson.id;
									isCancelModalOpen = true;
								}}
							>
								Cancel
							</Button>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
				{#if openRow === lesson.id}
					<TableBodyRow
						on:dblclick={() => {
							doubleClickModal = true;
							details = lesson;
						}}
						class="bg-white dark:bg-gray-900"
					>
						<TableBodyCell colspan="4" class="p-0">
							<Modal title={details?.name} bind:open={doubleClickModal} autoclose outsideclose>
								<ImagePlaceholder />
							</Modal>
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/each}
		{:else}
			{#each currentPageItems as lesson (lesson.id)}
				<TableBodyRow on:click={() => toggleRow(lesson.id)} class="bg-white dark:bg-gray-900">
					<TableBodyCell tdClass="px-4 py-3">{lesson.topic}</TableBodyCell>
					<TableBodyCell tdClass="px-4 py-3">{lesson.date}</TableBodyCell>
					<TableBodyCell tdClass="px-4 py-3">{lesson.time}</TableBodyCell>
					<TableBodyCell tdClass="px-4 py-3">
						<Button
							class="mr-2"
							size="sm"
							on:click={(event) => {
								event.stopPropagation();
								goto($page.url + '/' + lesson.id);
							}}
						>
							{lesson.isInSession ? 'Join' : 'View'}
						</Button>
						{#if role === 'lecturer'}
							<Button
								size="sm"
								color="red"
								on:click={(event) => {
									event.stopPropagation();
									id = lesson.id;
									isCancelModalOpen = true;
								}}
							>
								Cancel
							</Button>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
				{#if openRow === lesson.id}
					<TableBodyRow
						on:dblclick={() => {
							doubleClickModal = true;
							details = lesson;
						}}
						class="bg-white dark:bg-gray-900"
					>
						<TableBodyCell colspan="4" class="p-0">
							<Modal title={details?.name} bind:open={doubleClickModal} autoclose outsideclose>
								<ImagePlaceholder />
							</Modal>
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/each}
		{/if}
	</TableBody>
</TableSearch>

{#if totalPages > 1}
	<ButtonGroup>
		<Button on:click={loadPreviousPage} disabled={startRange === 1} iconLeft>
			<ChevronLeftOutline />
			Previous
		</Button>
		{#each pagesToShow as pageNumber}
			<Button on:click={() => goToPage(pageNumber)}>{pageNumber}</Button>
		{/each}
		<Button on:click={loadNextPage} disabled={endRange === totalItems} iconRight>
			<ChevronRightOutline />
			Next
		</Button>
	</ButtonGroup>
{/if}

<CancelModal bind:open={isCancelModalOpen} {id} />
