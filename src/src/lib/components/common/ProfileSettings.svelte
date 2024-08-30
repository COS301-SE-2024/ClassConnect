<script lang="ts">
	import { onMount } from 'svelte';
	import { change } from '$lib/store';
	import UpdateGeneralDetails from '$lib/components/forms/UpdateGeneralDetails.svelte';
	import UpdatePassword from '$lib/components/forms/UpdatePassword.svelte';
	import axios from 'axios';

	export let user: any;

	const apiUrl = '/api/user';

	async function getUserData() {
		try {
			axios
				.get(apiUrl)
				.then((response) => {
					user = response.data;
				})
				.catch((error) => {
					if (error.response) {
						console.error('Error response data:', error.response.data);
						console.error('Error response status:', error.response.status);
					} else if (error.request) {
						console.error('Error request:', error.request);
					} else {
						console.error('Error message:', error.message);
					}
				});
		} catch (error) {
			console.error('There was a problem with the get operation:', error);
		}
	}

	onMount(() => {
		getUserData();
	});

	$: {
		change.subscribe(() => {
			getUserData();
		});
	}
</script>

<div class="grid grid-cols-1 px-4 pt-6 dark:bg-gray-900 xl:grid-cols-3 xl:gap-4">
	<div class="col-span-10 items-center">
		<UpdateGeneralDetails name={user.name} email={user.email} surname={user.surname} />
		<UpdatePassword />
	</div>
</div>
