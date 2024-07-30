<script lang="ts">
    import { Button, Radio, Card } from 'flowbite-svelte';
    import Form from '$lib/components/questions/Form.svelte';
    import Submission from '$lib/components/modals/quizzes/Submission.svelte';
    //import { goto } from '$app/navigation';
   
    export let data: any;
    let isFormOpen = false;
    
    function toggleForm() {
      isFormOpen = !isFormOpen;
    }
   
    $: ({ questions, role } = data);
    $: console.log(questions);
   
    let selectedAnswers: { [key: string]: string } = {};
    let submitModalOpen = false;
    let submissionMessage = '';
    let totalPoints = 0;
   
    function handleSelection(questionId: string, optionContent: string) {
      selectedAnswers[questionId] = optionContent;
    }
   
    function handleQuizSubmission() {
      console.log('handleQuizSubmission is called');
      try {
        console.log('Calculating total points...');
        totalPoints = questions.reduce((total: number, question: any) => {
          const selectedOption = question.options.find(
            (option: any) => option.content === selectedAnswers[question.questionNumber]
          );
          return total + (selectedOption ? selectedOption.points : 0);
        }, 0);
        console.log('Total points calculated:', totalPoints);
        submissionMessage = `You have successfully submitted the quiz. Your score is ${totalPoints} points.`;
        submitModalOpen = true;
        // Optionally, you can navigate to a results page or perform other actions here
        // goto(`/workspaces/${workspaceId}/quizzes/${quizID}/results`);
      } catch (error) {
        console.error('Error in handleQuizSubmission:', error);
      }
    }
   </script>
   
   <main class="container mx-auto my-8 px-4">
    <h1 class="mb-4 text-2xl font-bold">Quiz Questions</h1>
    {#if role === 'student'}
      {#if questions.length === 0}
        <p class="text-gray-700 dark:text-gray-300">No questions available for this quiz.</p>
      {:else}
        <div class="space-y-6">
          {#each questions as question (question.id)}
            <Card>
              <h2 class="mb-2 text-xl font-bold">Question {question.questionNumber}</h2>
              <p class="mb-4 text-base font-normal text-gray-700 dark:text-gray-400">
                {question.questionContent}
              </p>
              <div class="space-y-2">
                {#each question.options as option}
                  <Radio
                    name={question.questionNumber}
                    value={option.content}
                    checked={selectedAnswers[question.questionNumber] === option.content}
                    on:change={() => handleSelection(question.questionNumber, option.content)}
                  >
                    {option.content}
                  </Radio>
                {/each}
              </div>
            </Card>
          {/each}
          <Button type="submit" on:click={handleQuizSubmission}>Submit Quiz</Button>
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