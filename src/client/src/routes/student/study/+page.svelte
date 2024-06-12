<script lang="ts">
	import ModuleSideBar from '$lib/components/utils/+ModuleSideBar.svelte';
	import Home from '$lib/components/student/+Home.svelte'
	import TopBar from '$lib/components/utils/+TopBar.svelte';
    const studyMaterials = [
        {
            date: '10 Oct',
            title: 'Introduction to Quantum Physics',
            description: 'This is a comprehensive introduction to the principles of quantum physics.',
            link: 'https://example.com/quantum_physics.pdf',
            image: 'https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
        },
        {
            date: '12 Oct',
            title: 'Advanced Calculus',
            description: 'This material covers advanced topics in calculus including integrals and derivatives.',
            link: 'https://example.com/advanced_calculus.pdf',
            image: 'https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
        },
        {
            date: '15 Oct',
            title: 'Machine Learning Basics',
            description: 'This material provides a basic understanding of machine learning principles and techniques.',
            link: 'https://example.com/machine_learning_basics.pdf',
            image: 'https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
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
						Study Material
					</h1>
				</div>
				{#each studyMaterials as material}
					<article class="flex bg-lightBgColor py-2 transition  dark:bg-gray-800">
						<div class="rotate-180 p-2 [writing-mode:_vertical-lr] dark:text-gray-300">
							<time
								datetime="2022-10-10"
								class="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900 dark:text-gray-300"
							>
								<span class="w-px flex-1 bg-gray-900/10 dark:bg-gray-400"></span>
								<span>{material.date}</span>
							</time>
						</div>
			
						<div class="flex flex-1 flex-col justify-between dark:bg-gray-800">
							<div class="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
								<a href="/">
									<h3 class="font-bold uppercase text-gray-900 dark:text-gray-300">
										{material.title}
									</h3>
								</a>
			
								<p class="mt-2 line-clamp-3 text-sm/relaxed text-gray-700 dark:text-gray-300">
									{material.description}
								</p>
							</div>
			
							<div class="sm:flex sm:items-end sm:justify-end">
								<a
									href="/"
									class="block bg-green-400 px-5 py-3 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-green-200"
								>
									Open Material
								</a>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</div>
</main>
