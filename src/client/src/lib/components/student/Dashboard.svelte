<script>
	export let data;

	$: ({ students, lecturers, workspaces } = data);
</script>

<div class="min-h-screen bg-gray-100 p-4 transition-colors duration-200 dark:bg-gray-900">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold dark:text-white">Student Dashboard</h1>
	</div>

	<div class="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-lg bg-white p-4 shadow transition-colors duration-200 dark:bg-gray-800">
			<div class="flex items-center">
				<div
					class="mr-6 inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
				>
					<svg
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M12 14l9-5-9-5-9 5 9 5z"></path>
						<path
							d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
						></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
						></path>
					</svg>
				</div>
				<div>
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Current GPA</p>
					<p class="text-2xl font-semibold text-gray-700 dark:text-white">{lecturers}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg bg-white p-4 shadow transition-colors duration-200 dark:bg-gray-800">
			<div class="flex items-center">
				<div
					class="mr-6 inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
				>
					<svg
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						></path>
					</svg>
				</div>
				<div>
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Courses Enrolled</p>
					<p class="text-2xl font-semibold text-gray-700 dark:text-white">{workspaces}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg bg-white p-4 shadow transition-colors duration-200 dark:bg-gray-800">
			<div class="flex items-center">
				<div
					class="mr-6 inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
				>
					<svg
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
				</div>
				<div>
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Assignments Due</p>
					<p class="text-2xl font-semibold text-gray-700 dark:text-white">{students}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg bg-white p-4 shadow transition-colors duration-200 dark:bg-gray-800">
			<div class="flex items-center">
				<div
					class="mr-6 inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
				>
					<svg
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						></path>
					</svg>
				</div>
				<div>
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Study Groups</p>
					<p class="text-2xl font-semibold text-gray-700 dark:text-white">2</p>
				</div>
			</div>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<div class="rounded-lg bg-white p-4 shadow transition-colors duration-200 dark:bg-gray-800">
			<h2 class="mb-4 text-xl font-semibold dark:text-white">Upcoming Assignments</h2>
			<ul class="space-y-2 dark:text-gray-300">
				<li>Math Homework - Due in 2 days</li>
				<li>Science Project - Due in 5 days</li>
				<li>English Essay - Due in 1 week</li>
			</ul>
		</div>
		<div class="rounded-lg bg-white p-4 shadow transition-colors duration-200 dark:bg-gray-800">
			<h2 class="mb-4 text-xl font-semibold dark:text-white">Recent Announcements</h2>
			<ul class="space-y-2 dark:text-gray-300">
				<li>Campus event next Friday</li>
				<li>Library hours extended for finals week</li>
				<li>New study resources available online</li>
			</ul>
		</div>
	</div>
</div>
