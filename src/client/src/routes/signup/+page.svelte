<script lang="ts">
    import LeftSideImage from '$lib/components/authentication/+LeftSideImage.svelte';
    import SignUpForm from '$lib/components/authentication/+SignUpForm.svelte';
    import AuroraBackground from "$lib/components/Utils/+AuroraBackground.svelte";
    let name = 'World';
</script>



<main>
    <div class="flex">
        <div class="w-1/2">
            <SignUpForm />
        </div>
        <div class="w-1/2">
            <LeftSideImage />
        </div>
    </div>
</main>