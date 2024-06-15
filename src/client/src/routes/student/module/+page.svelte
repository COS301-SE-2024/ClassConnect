<script lang="ts">
	import ModuleSideBar from '$lib/components/utils/student/+ModuleSideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	const announcements = [
		{
			date: '10 Oct',
			heading: 'Campus Safety Drill',
			announcement:
				'A campus-wide safety drill will be conducted on October 15th at 10 AM. All students and staff are required to participate. Please review the safety procedures and follow instructions during the drill.',
			image:
				'https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
		},
		{
			date: '12 Oct',
			heading: 'New Library Hours',
			announcement:
				'Starting October 20th, the university library will have extended hours. It will now be open from 8 AM to 12 AM, Monday through Friday, and 9 AM to 10 PM on weekends.',
			image:
				'https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
		},
		{
			date: '15 Oct',
			heading: 'Guest Lecture Series',
			announcement:
				'We are excited to announce a new guest lecture series starting October 25th. Prominent speakers from various fields will be sharing their insights. All students and faculty are encouraged to attend.',
			image:
				'https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
		}
	];	
</script>

<main>
	<div class="flex">
		<ModuleSideBar />
		<div class="flex-1">
			<TopBar />
			<div class="bg-lightBgColor dark:bg-gray-800">
				<div class="text-center">
					<h1 class="text-4xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
						Announcements
					</h1>
				</div>
				{#each announcements as announcement}
					<article class="flex bg-lightBgColor py-2 transition hover:shadow-xl dark:bg-gray-800">
						<div class="rotate-180 p-2 [writing-mode:_vertical-lr] dark:text-gray-300">
							<time
								datetime="2022-10-10"
								class="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900 dark:text-gray-300"
							>
								<span class="w-px flex-1 bg-gray-900/10 dark:bg-gray-400"></span>
								<span>{announcement.date}</span>
							</time>
						</div>
			
						<div class="flex flex-1 flex-col justify-between dark:bg-gray-800">
							<div class="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
								<a href="/">
									<h3 class="font-bold uppercase text-gray-900 dark:text-gray-300">
										{announcement.heading}
									</h3>
								</a>
			
								<p class="mt-2 line-clamp-3 text-sm/relaxed text-gray-700 dark:text-gray-300">
									{announcement.announcement}
								</p>
							</div>
			
							<div class="sm:flex sm:items-end sm:justify-end">
								<a
									href="/"
									class="block bg-green-400 px-5 py-3 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-green-200"
								>
									Read Full Announcement
								</a>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</div>
</main>