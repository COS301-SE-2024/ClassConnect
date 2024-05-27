<script lang="ts">
    import { Alert } from 'flowbite-svelte';
</script>

<main>
    <h1 class="text-3xl font-bold underline">
		Hello world!
	</h1>

    <div class="p-8">
        <Alert>
          <span class="font-medium">Info alert!</span>
          Change a few things up and try submitting again.
        </Alert>
    </div>

	<a href="/signup" class="text-blue-500 underline">Signup</a>

</main>
