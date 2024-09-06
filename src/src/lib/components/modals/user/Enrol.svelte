<script lang="ts">
	import { enhance } from '$app/forms';
	import { Avatar, Button, Toggle, Modal, Input } from 'flowbite-svelte';
	import toast from 'svelte-french-toast';

	export let id: string;
	export let role: string;
	export let open: boolean;
	export let workspaces: any;

	export let assignedWorkspaces: any;
	$: availableWorkspace = workspaces.filter(
		(workspace: { id: string }) => !assignedWorkspaces.includes(workspace.id)
	);
	$: studentWorkspaces = workspaces.filter((workspace: { id: string }) =>
		assignedWorkspaces.includes(workspace.id)
	);

	let error: string;
	let isEnrolling = true;

	function close() {
		return ({ result, update }: any) => {
			const promise = new Promise((resolve, reject) => {
				setTimeout(async () => {
					try {
						if (result.type === 'success') {
							await update();
							open = false;
							resolve(
								isEnrolling ? 'Student enrolled successfully!' : 'Student unenrolled successfully!'
							);
						} else {
							reject(result.data?.error || 'An unknown error occurred');
						}
					} catch (error) {
						reject(error);
					}
				}, 500);
			});

			toast.promise(promise, {
				loading: 'Changing detials...',
				success: (message) => `${message}`,
				error: (error) => `${error}`
			});

			return promise;
		};
	}

	let selectedWorkspaces: string[] = [];
</script>

<Modal bind:open size="sm" class="w-full">
	<form
		method="POST"
		action={isEnrolling ? '?/enrol' : '?/unenrol'}
		class="flex flex-col"
		use:enhance={close}
	>
		<div class="flex items-center justify-between">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">
				{isEnrolling ? 'Enrol' : 'Unenrol'}
				{role}
			</h3>

			<Toggle bind:checked={isEnrolling}>
				Switch to {isEnrolling ? 'Unenrol' : 'Enrol'}
			</Toggle>
		</div>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" id="id" name="id" value={id} size="md" readonly />

		<fieldset>
			{#if availableWorkspace.length > 0 && isEnrolling}
				<legend class="mb-2 mt-2 text-left">Select Workspaces</legend>

				{#each availableWorkspace as workspace}
					<label class="mb-2 flex items-center space-x-2">
						<input
							type="checkbox"
							name="workspaces"
							value={workspace.id}
							bind:group={selectedWorkspaces}
						/>

						<Avatar size="md" src={workspace.image} alt={workspace.name} />

						<span class="text-xl">{workspace.name}</span>
					</label>
				{/each}

				<Button type="submit" class="mt-4 w-full">
					{isEnrolling ? 'Enrol' : 'Unenrol'}
				</Button>
			{:else if assignedWorkspaces.length > 0 && !isEnrolling}
				<legend class="mb-2 mt-2 text-left">Select Workspaces</legend>

				{#each studentWorkspaces as workspace}
					<label class="mb-2 flex items-center space-x-2">
						<input
							type="checkbox"
							name="workspaces"
							value={workspace.id}
							bind:group={selectedWorkspaces}
						/>

						<Avatar size="md" src={workspace.image} alt={workspace.name} />

						<span class="text-xl">{workspace.name}</span>
					</label>
				{/each}

				<Button type="submit" class="mt-4 w-full">
					{isEnrolling ? 'Enrol' : 'Unenrol'}
				</Button>
			{:else}
				<p>No workspaces available for {isEnrolling ? 'enrollment' : 'unenrollment'}.</p>
			{/if}
		</fieldset>
	</form>
</Modal>
