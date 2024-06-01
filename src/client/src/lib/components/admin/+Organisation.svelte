<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import EditOrg from '$lib/components/modals/+EditOrg.svelte';
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
