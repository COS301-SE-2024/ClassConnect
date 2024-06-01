<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Profile from '$lib/components/admin/+Profile.svelte';
	import adjustments from '$lib/images/adjustments.svg';
	import { Tabs, TabItem, Button } from 'flowbite-svelte';
	const organisation = {
		organisationname: 'University of Pretoria',
		module: [
			{
				name: 'Operating Systems',
				code: 'CSOS101',
				description:
					'Introduction to operating systems, covering topics such as process management, memory management, and file systems.'
			},
			{
				name: 'Database Management Systems',
				code: 'CSDB202',
				description:
					'Study of database models, relational databases, SQL, and database design and implementation.'
			},
			{
				name: 'Network Security',
				code: 'CSNS303',
				description:
					'Fundamentals of network security, including encryption, firewalls, intrusion detection, and secure protocols.'
			},
			{
				name: 'Software Engineering',
				code: 'CSSE404',
				description:
					'Principles of software engineering, including software development life cycle, methodologies, and project management.'
			},
			{
				name: 'Artificial Intelligence',
				code: 'CSAI505',
				description:
					'Introduction to artificial intelligence concepts, including machine learning, neural networks, and natural language processing.'
			},
			{
				name: 'Cloud Computing',
				code: 'CSCC606',
				description:
					'Overview of cloud computing technologies, cloud service models, and deployment strategies.'
			},
			{
				name: 'Cybersecurity',
				code: 'CSCY707',
				description:
					'Comprehensive study of cybersecurity principles, risk management, and techniques to protect information systems.'
			},
			{
				name: 'Data Structures and Algorithms',
				code: 'CSDA808',
				description:
					'In-depth analysis of data structures and algorithms, including their design, implementation, and complexity analysis.'
			}
		]
	};
</script>

<section class="container mx-auto px-4">
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-lg font-medium text-gray-800 dark:text-white">Organisation</h2>
			</div>
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

				<span>Upload New Organisation Image</span>
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
				<span>Edit Organisation</span>
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
									<button class="flex items-center gap-x-3 focus:outline-none"> Feild </button>
								</th>

								<th
									scope="col"
									class="px-12 py-3.5 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
								>
									Value
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
							<tr>
								<td class="whitespace-nowrap px-4 py-4 text-sm font-medium">
									<div>
										<h2 class="font-medium text-gray-800 dark:text-white">Orgnisation Name</h2>
									</div>
								</td>
								<td class="whitespace-nowrap px-12 py-4 text-sm font-medium">
									{organisation.organisationname}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</section>
