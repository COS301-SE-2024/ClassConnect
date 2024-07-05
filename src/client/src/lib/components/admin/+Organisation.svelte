<script lang="ts">
	import { onMount } from 'svelte';
	import EditOrg from '$lib/components/admin/modals/edit/+EditOrg.svelte';
	import AddOrg from '$lib/components/admin/modals/add/+AddOrg.svelte';
	import RemoveOrg from '$lib/components/admin/modals/remove/+RemoveOrg.svelte';
	import { user, orgChange } from '$lib/store';
	import { writable } from 'svelte/store';

	let org_exists: boolean = false;
	const organisation_name = writable('');

	async function getOrgDetails() {
		if ($user) {
			try {
				const orgID: string = $user.getOrganisation();
				if (orgID !== '' && orgID !== undefined) {
					const org = $user.getOrgDetails();
					console.log('This is the new org: ', org);
					if (org) {
						org_exists = true;
						organisation_name.set(org.org_name);
					} else {
						org_exists = false;
					}
				} else {
					org_exists = false;
				}
			} catch (e) {
				console.error('Error getting organisation details:', e);
				org_exists = false;
			}
		} else {
			org_exists = false;
		}
	}

	onMount(getOrgDetails);

	$: {
		orgChange.subscribe(() => {
			getOrgDetails();
		});
	}
</script>

{#if org_exists}
	<section class="container mx-auto px-4">
		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-x-3">
					<h2 class="text-lg font-medium text-gray-800 dark:text-white">Organisation</h2>
				</div>
			</div>

			<div class="mt-4 flex items-center gap-x-3">
				<RemoveOrg />
				<EditOrg />
			</div>
		</div>

		<div class="mt-6 flex flex-col">
			<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
					<div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
						<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead class="bg-gray-50 dark:bg-gray-800">
								<tr>
									<th
										scope="col"
										class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
									>
										<button class="flex items-center gap-x-3 focus:outline-none"> Field </button>
									</th>

									<th
										scope="col"
										class="px-12 py-3.5 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
									>
										Value
									</th>
								</tr>
							</thead>
							<tbody
								class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900"
							>
								<tr>
									<td class="whitespace-nowrap px-4 py-4 text-sm font-medium">
										<div>
											<h2 class="font-medium text-gray-800 dark:text-gray-300">
												Organisation Name
											</h2>
										</div>
									</td>
									<td class="whitespace-nowrap px-12 py-4 text-sm font-medium dark:text-gray-300">
										{$organisation_name}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</section>
{:else}
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-lg font-medium text-gray-800 dark:text-white">Organisation Name</h2>
			</div>
		</div>

		<div class="mt-4 flex items-center gap-x-3">
			<AddOrg />
		</div>
	</div>
{/if}
