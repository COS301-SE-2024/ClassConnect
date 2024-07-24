<script lang="ts">
  import { Select, NumberInput, Input, Textarea, Button, Label } from 'flowbite-svelte';
  import { Toolbar, ToolbarGroup, ToolbarButton } from 'flowbite-svelte';
  import { PaperClipOutline, MapPinAltSolid, ImageOutline, CodeOutline, FaceGrinOutline, PaperPlaneOutline } from 'flowbite-svelte-icons';
  
  let questionNumber = '';
  let questionContent = '';
  let questionType = '';
  let options = [
    { content: '', points: 0 },
    { content: '', points: 0 },
    { content: '', points: 0 },
  ];
  
  const questionTypes = [
    { value: 'multiple choice', name: 'Multiple Choice' },
    { value: '3d-hotspot', name: '3D Hot spot' }
  ];
  
  function handleSubmit() {
    const question = {
      questionNumber,
      questionContent,
      questionType,
      options,
    };
    console.log('Submitted Question:', question);
  }
</script>

<main class="container mx-auto my-4 px-4">
  <form on:submit|preventDefault={handleSubmit}>
    <div class="mb-4">
      <label for="questionNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question Number</label>
      <Input id="questionNumber" bind:value={questionNumber} type="text" placeholder="Enter question number" required />
    </div>
    <div class="mb-4">
      <label for="questionType" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question Type</label>
      <Select id="questionType" items={questionTypes} bind:value={questionType} placeholder="Select question type" required />
    </div>
    <div class="mb-4">
      <label for="editor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question Content</label>
      <Textarea id="editor" rows="8" bind:value={questionContent} placeholder="Write the question content" required>
        <Toolbar slot="header" embedded>
          <ToolbarGroup>
            <ToolbarButton name="Attach file"><PaperClipOutline class="w-6 h-6 rotate-45" /></ToolbarButton>
            <ToolbarButton name="Embed map"><MapPinAltSolid class="w-6 h-6" /></ToolbarButton>
            <ToolbarButton name="Upload image"><ImageOutline class="w-6 h-6" /></ToolbarButton>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarButton name="Format code"><CodeOutline class="w-6 h-6" /></ToolbarButton>
            <ToolbarButton name="Add emoji"><FaceGrinOutline class="w-6 h-6" /></ToolbarButton>
          </ToolbarGroup>
          <ToolbarButton name="send" slot="end"><PaperPlaneOutline class="w-6 h-6 rotate-45" /></ToolbarButton>
        </Toolbar>
      </Textarea>
    </div>

    {#each options as option, index}
      <div class="mb-4">
        <Label class="space-y-2">
          <span>Option {index + 1}</span>
          <Input type="text" bind:value={option.content} placeholder="Write answer option" size="lg" />
        </Label>
      </div>
      <Label class="space-y-2 mb-4">
        <span>Points</span>
        <NumberInput bind:value={option.points} min={0} />
      </Label>
    {/each}

    <Button type="submit">Submit Question</Button>
  </form>
</main>
