<script lang="ts">
    import { Modal, Button } from 'flowbite-svelte';
    
    export let open: boolean = false;
    export let submissionMessage: string = '';
    export let totalPoints: number = 0;
    
    function closeModal() {
      open = false;
    }
  </script>
  
  <Modal bind:open size="xs" class="w-full">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Quiz Submission</h3>
    <p class="mb-4 text-base font-normal text-gray-700 dark:text-gray-400">
      {submissionMessage}
    </p>
    <p class="mb-4 text-lg font-semibold">
      Total Points: {totalPoints}
    </p>
    <Button on:click={closeModal} class="mt-4 w-full">Close</Button>
  </Modal>