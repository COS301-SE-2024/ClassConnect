<script lang="ts">
    import { Modal, Spinner } from 'flowbite-svelte';
    export let loading: boolean;
    export let text: string;
</script>

<Modal
    open={loading}
    size="xs"
    autoclose={false}
    class="relative flex flex-col items-center justify-center bg-white rounded-lg shadow dark:bg-gray-700 w-32 h-32"
    dismissable={false}
>
    <div class="flex flex-col items-center justify-center ">
        <Spinner color="green" size={8} class="mb-4" />
        <p class="text-lg text-center">{text}...</p>
    </div>
</Modal>
