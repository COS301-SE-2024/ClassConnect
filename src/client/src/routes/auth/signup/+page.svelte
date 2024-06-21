<script lang="ts">
	import LeftSideImage from '$lib/components/universal/auth/+LeftSideImage.svelte';
	import SignUpForm from '$lib/components/universal/auth/+SignUpForm.svelte';
</script>

<main>
	<div class="flex">
		<div class="w-1/2" style="z-index: 1;">
			<SignUpForm />
		</div>
		<div class="w-1/2" style="z-index: 1;">
			<LeftSideImage />
		</div>
	</div>
</main>
