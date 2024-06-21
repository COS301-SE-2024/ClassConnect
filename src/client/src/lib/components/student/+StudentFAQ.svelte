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
        category: "Modules",
        items: [
            {
                question: "How can I see the details of each module?",
                answer: "Each module is represented by a card on the dashboard. Click on a module card to view more details."
            },
            {
                question: "What information is displayed in the module cards?",
                answer: "The module cards display the module name and module ID."
            }
        ]
      },
      {
        category: "Study Material",
        items: [
            {
                question: "Where can I find study materials?",
                answer: "Study materials are displayed in a section with a grid of cards. Each card contains the title, description, and a link to the material."
            },
            {
                question: "How can I access the study materials?",
                answer: "Click on the link provided in each study material card to access the material."
            },
            {
                question: "What type of files can be viewed in the study materials section?",
                answer: "The section can display PDF files. The default PDF is provided, but it will update if a new file is uploaded."
            }
        ]
      },
      {
        category: "Online Classes",
        items: [
            {
                question: "How do I join an online class?",
                answer: "Online class details are managed by the call functionality. When you join a class, the system will manage your audio and video elements."
            },
            {
                question: "How can I control my microphone and camera during an online class?",
                answer: "There are buttons provided to toggle your microphone, camera, and screen sharing. You can also end the call using the End Call button."
            },
            {
                question: "How can I share my screen during an online class?",
                answer: "Click the Share Screen button to start or stop sharing your screen."
            },
            {
                question: "How can I leave an online class?",
                answer: "Click the End Call button to leave the online class and navigate back to the lessons page."
            },
            {
                question: "Can I see other participants in the online class?",
                answer: "Yes, the participants are displayed in a flex container. Each participant's audio and video elements are managed by the call functionality."
            },
            {
                question: "How is the video for participants handled?",
                answer: "Video elements are bound to participants, which manages the visibility and tracks of the video elements."
            }
        ]
      },
      {
        category: "3D Model & Controls",
        items: [
          {
            question: "Can I interact with 3D models on this page?",
            answer: "Yes, there are settings for interacting with 3D models, such as auto-rotation, zoom, and damping."
          },
          {
            question: "How can I adjust the settings for 3D models?",
            answer: "You can adjust settings like auto-rotate, damping, zoom speed, and more using the provided controls such as checkboxes and sliders in the Object Settings pane."
          },
          {
            question: "What type of 3D model is displayed on this page?",
            answer: "Any model that exist's in the workspace module."
          },
        ]
      },
    ];
  
    function toggleAnswer(index: number, subIndex: number) {
        faqs[index].items[subIndex].isOpen = !faqs[index].items[subIndex].isOpen;
    }
  </script>
 