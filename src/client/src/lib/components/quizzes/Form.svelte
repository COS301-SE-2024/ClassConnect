<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Input, Radio, Button } from 'flowbite-svelte';
  
    let title: string = '';
    let graded: boolean = false;
    const dispatch = createEventDispatcher();
  
    function handleSubmit(event: Event) {
      event.preventDefault();
      dispatch('submit', { title, graded });
    }
  </script>
  
  <form on:submit={handleSubmit} class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
      <Input
        id="title"
        bind:value={title}
        placeholder="Enter quiz title"
        required
        class="mt-1"
      />
    </div>
  
    <div>
        <div class="mt-2">
        <label class="block text-sm font-medium text-gray-700">Auto-Grade</label>
        <Radio
          id="graded-yes"
          name="graded"
          value="true"
          
          label="Yes"
          class="mr-4"
        />
        <Radio
          id="graded-no"
          name="graded"
          value="false"
          
          label="No"
        />
      </div>
    </div>
  
    <div>
      <Button type="submit" class="w-full">Submit</Button>
    </div>
  </form>
  