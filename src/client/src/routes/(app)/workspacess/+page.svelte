<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import StudentSideBar from '$lib/components/utils/student/+SideBar.svelte';
	import Home from '$lib/components/student/+Home.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
</script>

<main>
	<div class="flex">
		<StudentSideBar />
		<div class="flex-1">
			<TopBar />
			<Home modules={data.modules} />
		</div>
	</div>
</main>
