<!--
<script>
	import { Avatar, Navbar, DarkMode } from 'flowbite-svelte';
	import BreadCrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import { change } from '$lib/store';
	import { getUserData } from '$lib/utils';
	import { onMount } from 'svelte';

	export let data;

	$: ({ name, image, maps } = data);

	let isMobile;

	async function updateUserData() {
		try {
			const user = await getUserData();
			name = user.name;
			image = user.image;
		} catch (error) {
			console.error('There was a problem with the get operation:', error);
		}
	}

	onMount(async () => {
		updateUserData();
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	$: {
		change.subscribe(async () => {
			await updateUserData();
		});
	}
</script>

<div class="m-4 {isMobile ? 'ml-4' : 'ml-72'}">
	<Navbar
		data-testid="navbar"
		class="glassmorphic rounded-xl bg-white/60 px-4 py-2 shadow-md dark:bg-gray-900/60 transition-all duration-300 ease-in-out"
	>
		{#if !isMobile}
			<BreadCrumbs {maps} />
		{/if}

		<div class="flex items-center md:order-2">
			<DarkMode
				class="mx-2 border text-gray-500 dark:border-gray-800 dark:text-gray-600"
				data-testid="darkmode"
			/>

			<Avatar id="avatar-menu" src={image} class="mx-2" data-testid="avatar" />

			{#if !isMobile}
				<div class="mx-2">
					<div class="text-lg font-semibold">{name}</div>
				</div>
			{/if}
		</div>
	</Navbar>
</div>

<style>
	.glassmorphic {
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		position: relative;
		overflow: hidden;
	}

	.glassmorphic::before {
		content: "";
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
		transform: rotate(30deg);
		pointer-events: none;
	}
</style>
-->
