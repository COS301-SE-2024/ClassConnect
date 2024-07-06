<script lang="ts">
	import AdminWorkspaces from '$lib/components/admin/Workspaces.svelte';
	import LecturerWorkspaces from '$lib/components/lecturer/Workspaces.svelte';

<<<<<<< HEAD
	import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';

	import AddModal from '$lib/components/admin/modals/workspace/Add.svelte';
	import RemoveModal from '$lib/components/admin/modals/Delete.svelte';
	import EditModal from '$lib/components/admin/modals/workspace/Edit.svelte';

	interface Workspace {
		id: string;
		name: string;
		owner: string;
		image: string;
	}

	interface PageData {
		workspaces: Workspace[];
		lecturers: [{ id: string; name: string }];
	}

	export let data: PageData;

	let id: string;
	let isAddModalOpen = false;
	let isEditModalOpen = false;
	let isRemoveModalOpen = false;

	const headers: string[] = ['Name', 'Owner'];

	function handleEditModalOpen(lecturerId: string) {
		id = lecturerId;
		isEditModalOpen = true;
	}

	function handleRemoveModalOpen(lecturerId: string) {
		id = lecturerId;
		isRemoveModalOpen = true;
	}

	$: ({ lecturers, workspaces } = data);
=======
	export let data: any;
>>>>>>> update/routing
</script>

{#if data.role === 'admin'}
	<AdminWorkspaces {data} />
{:else if data.role === 'lecturer'}
	<LecturerWorkspaces {data} />
{:else if data.role === 'student'}
	<p>StudentDashboard</p>
{:else}
	<p>Unauthorized</p>
{/if}
