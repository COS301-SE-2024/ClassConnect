<script>
	import { spring } from 'svelte/motion';
	import AuroraBackground from '$lib/components/utils/+AuroraBackground.svelte';
	import LeftSideImage from '$lib/components/authentication/+LeftSideImage.svelte';
	import SignInForm from '$lib/components/authentication/+SignInForm.svelte';

</script>

<AuroraBackground>
	<main>

	<div class="flex">
		<div class="w-1/2">
			<SignInForm />
		</div>
		<div class="w-1/2">
			<LeftSideImage />
		</div>
	</div>

	</main>
</AuroraBackground>