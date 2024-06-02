<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import AddStudent from '$lib/components/modals/+AddStudent.svelte';
	import EditStudent from '$lib/components/modals/+EditStudent.svelte';
	const students = [
		{
			name: 'Azola Lukhozi',
			studentID: 'p21241605',
			status: 'Active',
			studies: 'Postgraduate',
			email: 'azola.lukhozi@demo.co.za'
		},
		{
			name: 'Dave Ka',
			studentID: 'p13220819',
			status: 'Active',
			studies: 'Postgraduate',
			email: 'dave.ka@demo.co.za'
		},
		{
			name: 'Bukhosi Mpande',
			studentID: 'u21240407',
			status: 'Active',
			studies: 'Undergraduate',
			email: 'bukhosi.mpande@demo.co.za'
		},
		{
			name: 'Ayanda Dlamini',
			studentID: 'u22231821',
			status: 'Active',
			studies: 'Undergraduate',
			email: 'ayanda.dlamini@demo.co.za'
		},
		{
			name: 'Ashley Kapaso',
			studentID: 'e21221302',
			status: 'Active',
			studies: 'Undergraduate',
			email: 'ashley.kapaso@demo.co.za'
		},
		{
			name: 'Ayanda Juqu',
			studentID: 'e22242314',
			status: 'Active',
			studies: 'Undergraduate',
			email: 'ayanda.juqu@demo.co.za'
		}
	];
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

		<a href="/students" class="text-green-600 hover:underline dark:text-green-400"> Students </a>
	</div>
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Students</h2>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>{students.length} {' '} lecturers</span
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
			<AddStudent />
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
								>
									<button class="flex items-center gap-x-2">
										<span>Studies</span>

										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke="currentColor"
											class="h-4 w-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
											/>
										</svg>
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
							{#each students as student}
								<tr>
									<td class="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700">
										<div class="inline-flex items-center gap-x-3">
											<div class="flex items-center gap-x-2">
												<img
													class="h-10 w-10 rounded-full object-cover"
													src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
													alt=""
												/>
												<div>
													<h2 class="font-medium text-gray-800 dark:text-white">{student.name}</h2>
													<p class="text-sm font-normal text-gray-600 dark:text-gray-400">
														{student.studentID}
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

											<h2 class="text-sm font-normal text-emerald-500">{student.status}</h2>
										</div>
									</td>
									<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300"
										>{student.studies}</td
									>
									<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300"
										>{student.email}</td
									>
									<td class="whitespace-nowrap px-4 py-4 text-sm">
										<div class="flex items-center gap-x-6">
											<EditStudent />
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
