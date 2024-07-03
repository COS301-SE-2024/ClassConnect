<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { user } from '$lib/store';
	export let data;

	for (const admin of data.admins) {
		$user.addAdmin(admin);
	}

	import SideBar from '$lib/components/utils/admin/+SideBar.svelte';
	import Admins from '$lib/components/admin/+Admins.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	
	console.log('This is the admin array passed in: ',data.admins)
	console.log('This is the user class in admins: ',$user)

</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="flex-1">
			<TopBar />
			<div class="w-[80%]">
				<Admins />
			</div>
		</div>
	</div>
</main>
