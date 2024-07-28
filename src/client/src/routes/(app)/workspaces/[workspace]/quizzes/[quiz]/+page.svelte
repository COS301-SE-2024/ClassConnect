<script lang="ts">
  import { Button, Radio, Card } from 'flowbite-svelte';
  import Form from '$lib/components/questions/Form.svelte';
  import Submission from '$lib/components/modals/quizzes/Submission.svelte';
  import { goto } from '$app/navigation';
  
  export let data: any;
  let isFormOpen = false;
  
  function toggleForm() {
      isFormOpen = !isFormOpen;
  }
  
  $: ({ questions, role } = data);
  $: console.log('Questions:', questions);
  
  
  let selectedAnswers: { [key: string]: string } = {};
  let submitModalOpen = false;
  let submissionMessage = '';
  let totalPoints = 0;
  
  function handleSelection(questionId: string, optionContent: string) {
      selectedAnswers[questionId] = optionContent;
      //goto(`/workspaces/${data.workspaceId}/quizzes/${data.quizID}`)
  }

  function handleSubmit() {
  
    totalPoints = questions.reduce((total: any, question: { options: any[]; id: string | number; }) => {
      const selectedOption = question.options.find(
        option => option.content === selectedAnswers[question.id]
      );
      return total + (selectedOption ? selectedOption.points : 0);
    }, 0);

    // Generate submission message
    submissionMessage = `You have successfully submitted the quiz. You answered ${Object.keys(selectedAnswers).length} out of ${questions.length} questions.`;

    // Open the submit modal
    submitModalOpen = true;
  }
  </script>
  
  <main class="container mx-auto my-8 px-4">
      <h1 class="mb-4 text-2xl font-bold">Quiz Questions</h1>
      
      {#if role === 'student'}
          {#if questions.length === 0}
              <p class="text-gray-700 dark:text-gray-300">No questions available for this quiz.</p>
          {:else}
              <div class="space-y-6">
                  {#each questions as question (question._id)}
                      <Card>
                          <h2 class="mb-2 text-xl font-bold">Question {question.questionNumber}</h2>
                          <p class="mb-4 text-base font-normal text-gray-700 dark:text-gray-400">
                              {question.questionContent}
                          </p>
                          <div class="space-y-2">
                              {#each question.options as option}
                                  <Radio 
                                      name={question._id}
                                      value={option.content}
                                      checked={selectedAnswers[question._id] === option.content}
                                      on:change={() => handleSelection(question._id, option.content)}
                                  >
                                      {option.content}
                                  </Radio>
                              {/each}
                          </div>
                      </Card>
                  {/each}
                  <Button on:click={handleSubmit}>Submit Quiz</Button>
              </div>
          {/if}
      {:else if role === 'lecturer'}
          <Form bind:open={isFormOpen} />
          {#if !isFormOpen}
              <Button on:click={toggleForm} class="mt-4">
                  Create New Question
              </Button>
          {/if}
      {:else}
          <p class="text-gray-700 dark:text-gray-300">You do not have permission to view this content.</p>
      {/if}
  </main>
  <Submission bind:open={submitModalOpen} {submissionMessage} {totalPoints} />