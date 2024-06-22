<script lang="ts">
    type FAQItem = {
        question: string;
        answer: string;
        isOpen?: boolean;
    };
    type FAQCategory = {
        category: string;
        items: FAQItem[];
    };
    let faqs: FAQCategory[] = [
        {
            category: "General",
            items: [
                {
                    question: "What is ClassConnect?",
                    answer: "ClassConnect is an innovative educational platform designed to facilitate virtual learning through a 3D environment. It enables lecturers to teach using 3D annotations and models, providing a more interactive and immersive learning experience for students."
                },
                {
                    question: "What motivated the creation of ClassConnect?",
                    answer: "The motivation behind ClassConnect is to leverage recent advancements in virtual reality, 3D rendering, and streaming to create decentralized and innovative learning methods, extending beyond traditional physical classrooms."
                }
            ]
        },
        {
            category: "User Enrollment",
            items: [
                {
                    question: "How do users sign up for ClassConnect?",
                    answer: "Lecturers and students can sign up or be enrolled into an organization’s workspace by an administrator, who can create the organization, add users, and manage workspaces."
                },
            ]
        },
        {
            category: "Schedule Lesson",
            items: [
                {
                    question: "What does the Schedule Lesson button do?",
                    answer: "The Schedule Lesson button opens a modal where lecturers can enter details such as the topic, date, and time of the lesson. Upon submitting the form, the lesson is scheduled."
                },
                {
                    question: "What information is required to schedule a lesson?",
                    answer: "To schedule a lesson, you need to provide the topic, date, and time."
                },
                {
                    question: "How do I submit the scheduling form?",
                    answer: "Fill in the required fields and click the Schedule button to submit the form. The form submission is handled by the handleSubmit function."
                }
            ]
        },
        {
            category: "Study Material",
            items: [
                {
                    question: "What does the Upload button do?",
                    answer: "The Upload button opens a modal where lecturers can upload study materials by providing a title, description, and selecting a file to upload."
                },
                {
                    question: "What information is required to upload study materials?",
                    answer: "You need to provide a title, description, and select a file to upload."
                },
                {
                    question: "How do I submit the upload form?",
                    answer: "Fill in the required fields and click the Upload File button to submit the form. The form submission is handled by the handleUpload function."
                }
            ]
        },
        {
            category: "Lesson Overview & Management",
            items: [
                {
                    question: "What information is displayed in the lessons table?",
                    answer: "The lessons table displays the topic, date, and time of each lesson. There are separate sections for In Session and Upcoming lessons."
                },
                {
                    question: "How can I join a lesson?",
                    answer: "Click the Join button next to the lesson you want to join. This button uses the goto function to navigate to the lesson's page."
                }
            ]
        },
        {
            category: "Tabs Functionality",
            items: [
                {
                    question: "What are the different tabs available?",
                    answer: "There are three tabs: Overview, Study Material Upload, and 3D Material Upload. Each tab provides different functionalities and information."
                },
                {
                    question: "What can I do in the Overview tab?",
                    answer: "The Overview tab displays general information and statistics about lessons, students, and study materials."
                },
                {
                    question: "What can I do in the Study Material Upload tab?",
                    answer: "The Study Material Upload tab provides information about study materials and allows lecturers to upload new study materials."
                },
                {
                    question: "How can I leave an online class?",
                    answer: "Click the End Call button to leave the online class and navigate back to the lessons page."
                },
                {
                    question: "What can I do in the 3D Material Upload tab?",
                    answer: "The 3D Material Upload tab provides information about 3D materials and allows lecturers to upload new 3D materials."
                },
            ]
        },
        {
            category: "Video & Audio Management",
            items: [
                {
                    question: "How do I manage audio and video during a call?",
                    answer: "You can use the buttons provided to toggle the microphone, camera, and screen sharing. You can also end the call using the End Call button."
                },
                {
                    question: "What happens when I click the Mic button?",
                    answer: "Clicking the Mic button toggles the microphone on or off for the call."
                },
                {
                    question: "What happens when I click the Camera button?",
                    answer: "Clicking the Camera button toggles the camera on or off for the call."
                },
                {
                    question: "What happens when I click the Share Screen button?",
                    answer: "Clicking the Share Screen button toggles screen sharing on or off for the call."
                },
                {
                    question: "How do I end a call?",
                    answer: "Click the End Call button to leave the call and navigate back to the lessons page."
                },
            ]
        },
    ];

    function toggleAnswer(index: number, subIndex: number) {
        faqs[index].items[subIndex].isOpen = !faqs[index].items[subIndex].isOpen;
    }

</script>

<div>
    {#each faqs as faq, index}
      <div class="faq-category">
        <h3>{faq.category}</h3>
        {#each faq.items as item, subIndex}
          <button class="faq-question" on:click={() => toggleAnswer(index, subIndex)} on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && toggleAnswer(index, subIndex)}>
            {item.question}
          </button>
          {#if item.isOpen}
            <div class="faq-answer">
              {item.answer}
            </div>
          {/if}
        {/each}
      </div>
    {/each}
  </div>