<script lang="ts">
    import { NumberInput,Input, Textarea, Button,Label } from 'flowbite-svelte';
    import { Toolbar, ToolbarGroup, ToolbarButton } from 'flowbite-svelte';
    import { PaperClipOutline, MapPinAltSolid, ImageOutline, CodeOutline, FaceGrinOutline, PaperPlaneOutline } from 'flowbite-svelte-icons';
    
    let questionNumber = '';
    let questionContent = '';
    let value1=0;
    let value2=0;
    let value3=0;
    let option1 = '';
    let points = '';
    
    function handleSubmit() {
      console.log('Question Number:', questionNumber);
      console.log('Question Content:', questionContent);
      console.log('Points:', points);
    }
  </script>
  
  <main class="container mx-auto my-4 px-4">
    <form on:submit|preventDefault={handleSubmit}>
      <div class="mb-4">
        <label for="questionNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question Number</label>
        <Input id="questionNumber" bind:value={questionNumber} type="text" placeholder="Enter question number" required />
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

      <div class="mb-4">
        <Label class="space-y-2">
            <span>Option 1</span>
            <Input type="text" bind:value={option1} placeholder="Write answer option" size="lg" />
        </Label>
      </div>

      <Label class="space-y-2 mb-4">
        <span>Points</span>
        <NumberInput bind:value1 />
      </Label>

      

      <div class="mb-4">
        <Label class="space-y-2">
            <span>Option 2</span>
            <Input type="text" placeholder="Write answer option" size="lg" />
        </Label>
      </div>

      <Label class="space-y-2 mb-4">
        <span>Points</span>
        <NumberInput bind:value2 />
      </Label>

      <div class="mb-4">
        <Label class="space-y-2">
            <span>Option 3</span>
            <Input type="text" placeholder="Write answer option" size="lg" />
        </Label>
      </div>
      
      <Label class="space-y-2 mb-4">
        <span>Points</span>
        <NumberInput bind:value3 />
      </Label>
      

      <Button type="submit">Submit Question</Button>
    </form>
  </main>
  