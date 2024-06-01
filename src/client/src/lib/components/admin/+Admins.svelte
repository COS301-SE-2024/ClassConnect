<script lang="ts">
	import { Tabs, TabItem, Button } from 'flowbite-svelte';
	const admins = [
		{
			name: 'Katlego Tau',
			adminID: 'a21241605',
			status: 'Active',
			department: 'Humanities',
			email: 'katlego.tau@demo.co.za'
		},
		{
			name: 'Bongiwe Dlamini',
			adminID: 'p13220819',
			status: 'Active',
			department: 'Law',
			email: 'bongiwe.dlamini@demo.co.za'
		},
		{
			name: 'Hein Venter',
			adminID: 'u21240407',
			status: 'Active',
			department: 'Arts',
			email: 'hein.venter@demo.co.za'
		},
		{
			name: 'Ayanda Dlamini',
			adminID: 'u22231821',
			status: 'Active',
			department: 'Infomation Technology',
			email: 'ayanda.dlamini@demo.co.za'
		},
		{
			name: 'Lesedi Mogale',
			adminID: 'e21221302',
			status: 'Active',
			department: 'Engineering',
			email: 'lesedi.mogale@demo.co.za'
		},
		{
			name: 'Ayanda Juqu',
			adminID: 'e22242314',
			status: 'Active',
			department: 'Health Sciences',
			email: 'ayanda.juqu@demo.co.za'
		}
	];
</script>

<section class="container mx-auto my-2 px-4">
	<div class="flex items-center overflow-x-auto whitespace-nowrap py-4">
		<a href="#" class="text-gray-600 dark:text-gray-200">
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

		<a href="/admins" class="text-green-600 hover:underline dark:text-green-400"> Admins </a>
	</div>
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Admins</h2>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>{admins.length} {' '} lecturers</span
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
			<button
				class="flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clip-path="url(#clip0_3098_154395)">
						<path
							d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832"
							stroke="currentColor"
							stroke-width="1.67"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</g>
					<defs>
						<clipPath id="clip0_3098_154395">
							<rect width="20" height="20" fill="white" />
						</clipPath>
					</defs>
				</svg>

				<span>Import</span>
			</button>

			<Button>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-5 w-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>Add Admin</span>
			</Button>
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
										<span>Department</span>

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
							{#each admins as admin}
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
													<h2 class="font-medium text-gray-800 dark:text-white">{admin.name}</h2>
													<p class="text-sm font-normal text-gray-600 dark:text-gray-400">
														{admin.adminID}
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

											<h2 class="text-sm font-normal text-emerald-500">{admin.status}</h2>
										</div>
									</td>
									<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300"
										>{admin.department}</td
									>
									<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300"
										>{admin.email}</td
									>
									<td class="whitespace-nowrap px-4 py-4 text-sm">
										<div class="flex items-center gap-x-6">
											<button
												class="text-gray-500 transition-colors duration-200 hover:text-yellow-500 focus:outline-none dark:text-gray-300 dark:hover:text-yellow-500"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="h-5 w-5"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
													/>
												</svg>
											</button>
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
