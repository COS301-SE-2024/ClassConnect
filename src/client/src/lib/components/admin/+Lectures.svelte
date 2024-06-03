<script lang="ts">
	import { onMount } from 'svelte';
	import { lecturers } from '../../stores/store';
	import { lecChange } from '../../stores/store';
	import { getUsers } from '../../../services/users';
	import AddLecturer from '$lib/components/modals/+AddLecturer.svelte';
	import EditLecturer from '$lib/components/modals/+EditLecturer.svelte';
	import Remove from '$lib/components/modals/+Remove.svelte';

	async function loadLecturers() {
		const users = await getUsers({ role: 'lecturer' });
		lecturers.set(users);
	}

	onMount(loadLecturers);

	$: {
		lecChange.subscribe(() => {
			loadLecturers();
		});
	}
</script>

<section class="container mx-auto my-2 px-4">
	<div class="flex items-center overflow-x-auto whitespace-nowrap py-4">
		<a href="/" class="text-gray-600 dark:text-gray-200">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
				/>
			</svg>
		</a>

		<span class="mx-5 text-gray-500 dark:text-gray-300"> / </span>

		<a href="/lecturers" class="text-green-600 hover:underline dark:text-green-400"> Lecturers </a>
	</div>

	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Lecturers</h2>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>{$lecturers.length} {' '} lecturers</span
				>
			</div>
		</div>

		<div class="relative mt-4 flex items-center md:mt-0">
			<span class="absolute">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mx-3 h-5 w-5 text-gray-400 dark:text-gray-600"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
					/>
				</svg>
			</span>

			<input
				type="text"
				placeholder="Search"
				class="block w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-11 pr-5 text-gray-700 placeholder-gray-400/70 focus:border-green-400 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-green-300 md:w-80 rtl:pl-5 rtl:pr-11"
			/>
		</div>

		<div class="mt-4 flex items-center gap-x-3">
			<AddLecturer />
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
									<div class="flex items-center gap-x-3">
										<span>Name</span>
									</div>
								</th>

								<th
									scope="col"
									class="px-12 py-3.5 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
								>
									<button class="flex items-center gap-x-2">
										<span>Status</span>
									</button>
								</th>

								<th
									scope="col"
									class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
									>Email address</th
								>

								<th scope="col" class="relative px-4 py-3.5">
									<span class="sr-only">Edit</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
							{#each $lecturers as lecturer}
								<tr>
									<td class="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700">
										<div class="inline-flex items-center gap-x-3">
											<div class="flex items-center gap-x-2">
												<img
													class="h-10 w-10 rounded-full object-cover"
													src={lecturer.image}
													alt=""
												/>
												<div>
													<h2 class="font-medium text-gray-800 dark:text-white">
														{lecturer.name}
														{lecturer.surname}
													</h2>
													<p class="text-sm font-normal text-gray-600 dark:text-gray-400">
														{lecturer.username}
													</p>
												</div>
											</div>
										</div>
									</td>
									<td class="whitespace-nowrap px-12 py-4 text-sm font-medium text-gray-700">
										<div
											class="inline-flex items-center gap-x-2 rounded-full bg-emerald-100/60 px-3 py-1 dark:bg-gray-800"
										>
											<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

											<h2 class="text-sm font-normal text-emerald-500">Online</h2>
										</div>
									</td>
									<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300"
										>{lecturer.email}</td
									>
									<td class="whitespace-nowrap px-4 py-4 text-sm">
										<div class="flex items-center gap-x-6">
											<Remove bind:id={lecturer._id} />
											<EditLecturer bind:lecturerID={lecturer._id} />
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</section>
