<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button, Card } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
</script>

<main class="container mx-auto my-2 px-4">
	<h1 class="mb-8 text-center text-3xl font-bold dark:text-white">Choose Your Environment</h1>

	<div class="flex flex-wrap justify-center">
		<Card
			img="/images/view-3D-models-1.jpg"
			imgClass="h-48 object-cover rounded-lg"
			class="m-2 max-w-[45%] flex-grow p-4"
		>
			<h5 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">3D Playground</h5>

			<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
				Explore and view 3D models of your workspace or your own creations. Experience them in VR
				for an immersive perspective.
			</p>

			<Button on:click={() => goto($page.url + '/sandbox')}>
				Enter Playground
				<ArrowRightOutline />
			</Button>
		</Card>

		<Card
			img="/images/virtual-classroom.jpg"
			imgClass="h-48 object-cover rounded-lg"
			class="m-2 max-w-[45%] flex-grow p-4"
		>
			<h5 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">VR Playground</h5>

			<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
				Join your classmates in a virtual space to learn, discuss, and explore together. Collaborate
				in real-time and enhance your learning experience.
			</p>

			<Button disabled on:click={() => goto($page.url + '/playground')}>
				Coming Soon
				<ArrowRightOutline />
			</Button>
		</Card>

		<Card
		img="/images/virtual-classroom.jpg"
		imgClass="h-48 object-cover rounded-lg"
		class="m-2 max-w-[45%] flex-grow p-4"
	>
		<h5 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">VR Playground</h5>

		<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
			Join your classmates in a virtual space to learn, discuss, and explore together. Collaborate
			in real-time and enhance your learning experience.
		</p>

		<Button  on:click={() => goto($page.url + '/simulation')}>
			Enter Simulation
			<ArrowRightOutline />
		</Button>
	</Card>
	</div>
</main>
