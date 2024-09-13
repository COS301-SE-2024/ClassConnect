<script lang="ts">
    import {  Card, Heading, P } from 'flowbite-svelte';
    
    export let questions: any[] = [];
   
  </script>
  
  <div class="space-y-8">
    {#each questions as question (question.id)}
      <Card size="none" padding="xl" class="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
        <Heading tag="h2" class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Question {question.questionNumber}
        </Heading>
        <P class="mb-6 text-lg text-gray-700 dark:text-gray-300">
          {question.questionContent}
        </P>
        <div class="mb-4">
			<slot name="scene" />
		</div>
      </Card>
    {/each}
  </div>
  