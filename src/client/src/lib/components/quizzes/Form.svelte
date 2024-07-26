<script lang="ts">
  import { NumberInput, Input, Textarea, Button, Label } from 'flowbite-svelte';
  export let open: boolean;

  let questionNumber = '';
  let questionContent = '';
  let options = ['', '', ''];  
  let points = [0, 0, 0];  
  
  function handleSubmit() {
    console.log('Question Number:', questionNumber);
    console.log('Question Content:', questionContent);
    console.log('Options:', options);
    console.log('Points:', points);
  }
</script>

<main class="container mx-auto my-4 px-4">
  <form on:submit|preventDefault={handleSubmit}>
    <div class="mb-4">
      <Label for="questionNumber">Question Number</Label>
      <Input id="questionNumber" bind:value={questionNumber} type="text" placeholder="Enter question number" required />
    </div>
    <div class="mb-4">
      <Label for="editor">Question Content</Label>
      <Textarea id="editor" rows="8" bind:value={questionContent} placeholder="Write the question content" required />
    </div>

    {#each options as option, index}
      <div class="mb-4">
        <Label>
          Option {index + 1}
          <Input type="text" bind:value={options[index]} placeholder="Write answer option" size="lg" />
        </Label>
      </div>
      <Label class="space-y-2 mb-4">
        <span>Points</span>
        <NumberInput bind:value={points[index]} />
      </Label>
    {/each}

    <Button type="submit">Submit Question</Button>
  </form>
</main>
