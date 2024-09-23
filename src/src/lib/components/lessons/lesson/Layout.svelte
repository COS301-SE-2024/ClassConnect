<script lang="ts">
	import { onMount } from 'svelte';
	import Scene from './Scene.svelte';
	import Controls from './Controls.svelte';
	import AttendanceList from './AttendanceList.svelte';
	import Chat from './Chat.svelte';
	import Environment from './Environment.svelte';

	let activeView = 'video';
	let showSidebar = false;
	let isMobile = false;

	// Add state variables for Controls component
	let isMicOn = false;
	let isCameraOn = false;
	let isScreenSharing = false;
	let is3DModelActive = false;
	let isRecording = false;

	function toggleSidebar() {
		showSidebar = !showSidebar;
	}

	function handleResize() {
		isMobile = window.innerWidth < 768;
		if (!isMobile) {
			showSidebar = false;
		}
	}

	onMount(() => {
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	function handleViewChange(view: string) {
		activeView = view;
	}
</script>

<main class="flex h-screen flex-col bg-gray-100">
	<div class="flex flex-1 overflow-hidden">
		<!-- Main content area -->
		<div class="flex flex-1 flex-col overflow-hidden">
			{#if activeView === 'video'}
				<div class="relative flex-1">
					<!-- Video content goes here -->
					<p class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
						Video Content
					</p>
				</div>
			{:else if activeView === 'screen'}
				<div class="relative flex-1">
					<!-- Screen share content goes here -->
					<p class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
						Screen Share Content
					</p>
				</div>
			{:else if activeView === '3d'}
				<Environment />
			{/if}
		</div>

		<!-- Sidebar for chat and attendance list -->
		{#if showSidebar}
			<div class="flex w-64 flex-col overflow-hidden bg-white shadow-lg">
				<div class="flex-none border-b">
					<div class="flex">
						<button
							class="flex-1 px-4 py-2 text-center {activeView === 'chat'
								? 'bg-blue-500 text-white'
								: 'bg-gray-200'}"
							on:click={() => (activeView = 'chat')}
						>
							Chat
						</button>
						<button
							class="flex-1 px-4 py-2 text-center {activeView === 'attendance'
								? 'bg-blue-500 text-white'
								: 'bg-gray-200'}"
							on:click={() => (activeView = 'attendance')}
						>
							Attendance
						</button>
					</div>
				</div>
				<div class="flex-1 overflow-y-auto">
					{#if activeView === 'chat'}
						<Chat />
					{:else if activeView === 'attendance'}
						<AttendanceList />
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Bottom controls -->
	<Controls
		bind:isMicOn
		bind:isCameraOn
		bind:isScreenSharing
		bind:is3DModelActive
		bind:isRecording
		on:viewChange={handleViewChange}
	/>

	{#if isMobile}
		<button
			class="fixed bottom-4 right-4 rounded bg-gray-700 px-4 py-2 text-white"
			on:click={toggleSidebar}
		>
			{showSidebar ? 'Hide' : 'Show'} Sidebar
		</button>
	{/if}
</main>
