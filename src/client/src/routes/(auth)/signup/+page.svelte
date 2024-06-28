<script lang="ts">
	import SideImage from './SideImage.svelte';
	import SignUpForm from './SignUpForm.svelte';

	export let form;
</script>

<main>
	<div class="flex">
		<div class="w-1/2" style="z-index: 1;">
			<SignUpForm {form}/>
		</div>
		<div class="w-1/2" style="z-index: 1;">
			<SideImage />
		</div>
	</div>
</main>
