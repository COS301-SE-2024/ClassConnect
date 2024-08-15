// @ts-nocheck
/** @param {Parameters<import('./$types').PageLoad>[0]} event */

export async function load({ locals }) {
	if (locals.user) {
		const faq = {
			student: [
				{
					category: 'General',
					items: [
						{
							question: 'What is ClassConnect?',
							answer:
								'ClassConnect is an innovative educational platform designed to facilitate virtual learning through a 3D environment. It enables lecturers to teach using 3D annotations and models, providing a more interactive and immersive learning experience for students.'
						},
						{
							question: 'What motivated the creation of ClassConnect?',
							answer:
								'The motivation behind ClassConnect is to leverage recent advancements in virtual reality, 3D rendering, and streaming to create decentralized and innovative learning methods, extending beyond traditional physical classrooms.'
						}
					]
				},
				{
					category: 'Dashboard',
					items: [
						{
							question: 'What is the dashboard?',
							answer:
								'Students can quickly overview their module, including how their performance compares to the class average, their schedule for the module, recent announcements, and various assignments associated with the module.'
						},
						{
							question: 'What information can I see in the Average Percentages section',
							answer:
								'The Average Percentages section provides a visual comparison of your performance against the class average. You can see how your percentage scores for each month compare to those of your peers, helping you gauge your progress in the module.'
						},
						{
							question: 'Where can I find my module schedule?',
							answer:
								'Your module schedule is available under the Schedule section. It lists the most recent dates and events, such as upcoming classes, assignment deadlines, and other key activities related to your module.'
						},
						{
							question: 'What details are shown in the Your Assignments section?',
							answer:
								'The Your Assignments section displays a list of your assignments, including the title, due date, and status (e.g., To Do, In Progress, Completed). If you have received a grade for an assignment, it will also be shown here.'
						},
						{
							question: 'How do I know the status of my assignments?',
							answer:
								'Each assignment in the Your Assignments section is labeled with a status badge. This badge indicates whether the assignment is still to be done, in progress, or completed. The color of the badge (red, yellow, green) helps you quickly identify the status.'
						},
						{
							question: 'Can I view my assignments in one place?',
							answer:
								'Yes, you can view all your assignments by clicking the View all link in the Your Assignments section. This will take you to a page where you can see a comprehensive list of all your assignments, including those that are upcoming, in progress, or completed.'
						}
					]
				},
				{
					category: 'Workspaces',
					items: [
						{
							question: 'What are workspaces?',
							answer:
								'Workspaces lists all the modules that the student is taking. Each module is represented by a card which the user can click on to view more details about said module.'
						},
						{
							question: 'What if I do not see a module that I have registered for?',
							answer: 'Please consult with your department' + "'s faculaty advisor."
						}
					]
				},
				{
					category: 'Announcemnts',
					items: [
						{
							question: 'What are announcements?',
							answer:
								'Announcements list any announcement produced by Admin or Lecturers (if the student is taking that lecturer' +
								"'s module)."
						}
					]
				},
				{
					category: 'Grades',
					items: [
						{
							question: 'What are grades?',
							answer:
								'Grades list all the marks of the student for every module that the student is taking.'
						}
					]
				},
				{
					category: 'User Enrollment',
					items: [
						{
							question: 'How do users sign up for ClassConnect?',
							answer:
								'Lecturers and students can sign up or be enrolled into an organization’s workspace by an administrator, who can create the organization, add users, and manage workspaces.'
						}
					]
				},
				{
					category: 'Modules',
					items: [
						{
							question: 'How can I see the details of each module?',
							answer:
								'Each module is represented by a card on the dashboard. Click on a module card to view more details.'
						},
						{
							question: 'What information is displayed in the module cards?',
							answer: 'The module cards display the module name and module ID.'
						}
					]
				},
				{
					category: 'Study Material',
					items: [
						{
							question: 'Where can I find study materials?',
							answer:
								'Study materials are displayed in a section with a grid of cards. Each card contains the title, description, and a link to the material.'
						},
						{
							question: 'How can I access the study materials?',
							answer:
								'Click on the link provided in each study material card to access the material.'
						},
						{
							question: 'What type of files can be viewed in the study materials section?',
							answer:
								'The section can display PDF files. The default PDF is provided, but it will update if a new file is uploaded.'
						}
					]
				},
				{
					category: 'Online Classes',
					items: [
						{
							question: 'How do I join an online class?',
							answer:
								'Online class details are managed by the call functionality. When you join a class, the system will manage your audio and video elements.'
						},
						{
							question: 'How can I control my microphone and camera during an online class?',
							answer:
								'There are buttons provided to toggle your microphone, camera, and screen sharing. You can also end the call using the End Call button.'
						},
						{
							question: 'How can I share my screen during an online class?',
							answer: 'Click the Share Screen button to start or stop sharing your screen.'
						},
						{
							question: 'How can I leave an online class?',
							answer:
								'Click the End Call button to leave the online class and navigate back to the lessons page.'
						},
						{
							question: 'Can I see other participants in the online class?',
							answer:
								"Yes, the participants are displayed in a flex container. Each participant's audio and video elements are managed by the call functionality."
						},
						{
							question: 'How is the video for participants handled?',
							answer:
								'Video elements are bound to participants, which manages the visibility and tracks of the video elements.'
						}
					]
				},
				{
					category: '3D Model & Controls',
					items: [
						{
							question: 'Can I interact with 3D models on this page?',
							answer:
								'Yes, there are settings for interacting with 3D models, such as auto-rotation, zoom, and damping.'
						},
						{
							question: 'How can I adjust the settings for 3D models?',
							answer:
								'You can adjust settings like auto-rotate, damping, zoom speed, and more using the provided controls such as checkboxes and sliders in the Object Settings pane.'
						},
						{
							question: 'What type of 3D model is displayed on this page?',
							answer: "Any model that exist's in the workspace module."
						}
					]
				}
			],
			lecturer: [
				{
					category: 'General',
					items: [
						{
							question: 'What is ClassConnect?',
							answer:
								'ClassConnect is an innovative educational platform designed to facilitate virtual learning through a 3D environment. It enables lecturers to teach using 3D annotations and models, providing a more interactive and immersive learning experience for students.'
						},
						{
							question: 'What motivated the creation of ClassConnect?',
							answer:
								'The motivation behind ClassConnect is to leverage recent advancements in virtual reality, 3D rendering, and streaming to create decentralized and innovative learning methods, extending beyond traditional physical classrooms.'
						}
					]
				},
				{
					category: 'User Enrollment',
					items: [
						{
							question: 'How do users sign up for ClassConnect?',
							answer:
								'Lecturers and students can sign up or be enrolled into an organization’s workspace by an administrator, who can create the organization, add users, and manage workspaces.'
						}
					]
				},
				{
					category: 'Schedule Lesson',
					items: [
						{
							question: 'What does the Schedule Lesson button do?',
							answer:
								'The Schedule Lesson button opens a modal where lecturers can enter details such as the topic, date, and time of the lesson. Upon submitting the form, the lesson is scheduled.'
						},
						{
							question: 'What information is required to schedule a lesson?',
							answer: 'To schedule a lesson, you need to provide the topic, date, and time.'
						},
						{
							question: 'How do I submit the scheduling form?',
							answer:
								'Fill in the required fields and click the Schedule button to submit the form. The form submission is handled by the handleSubmit function.'
						}
					]
				},
				{
					category: 'Study Material',
					items: [
						{
							question: 'What does the Upload button do?',
							answer:
								'The Upload button opens a modal where lecturers can upload study materials by providing a title, description, and selecting a file to upload.'
						},
						{
							question: 'What information is required to upload study materials?',
							answer: 'You need to provide a title, description, and select a file to upload.'
						},
						{
							question: 'How do I submit the upload form?',
							answer:
								'Fill in the required fields and click the Upload File button to submit the form. The form submission is handled by the handleUpload function.'
						}
					]
				},
				{
					category: 'Lesson Overview & Management',
					items: [
						{
							question: 'What information is displayed in the lessons table?',
							answer:
								'The lessons table displays the topic, date, and time of each lesson. There are separate sections for In Session and Upcoming lessons.'
						},
						{
							question: 'How can I join a lesson?',
							answer:
								"Click the Join button next to the lesson you want to join. This button uses the goto function to navigate to the lesson's page."
						}
					]
				},
				{
					category: 'Tabs Functionality',
					items: [
						{
							question: 'What are the different tabs available?',
							answer:
								'There are three tabs: Overview, Study Material Upload, and 3D Material Upload. Each tab provides different functionalities and information.'
						},
						{
							question: 'What can I do in the Overview tab?',
							answer:
								'The Overview tab displays general information and statistics about lessons, students, and study materials.'
						},
						{
							question: 'What can I do in the Study Material Upload tab?',
							answer:
								'The Study Material Upload tab provides information about study materials and allows lecturers to upload new study materials.'
						},
						{
							question: 'How can I leave an online class?',
							answer:
								'Click the End Call button to leave the online class and navigate back to the lessons page.'
						},
						{
							question: 'What can I do in the 3D Material Upload tab?',
							answer:
								'The 3D Material Upload tab provides information about 3D materials and allows lecturers to upload new 3D materials.'
						}
					]
				},
				{
					category: 'Video & Audio Management',
					items: [
						{
							question: 'How do I manage audio and video during a call?',
							answer:
								'You can use the buttons provided to toggle the microphone, camera, and screen sharing. You can also end the call using the End Call button.'
						},
						{
							question: 'What happens when I click the Mic button?',
							answer: 'Clicking the Mic button toggles the microphone on or off for the call.'
						},
						{
							question: 'What happens when I click the Camera button?',
							answer: 'Clicking the Camera button toggles the camera on or off for the call.'
						},
						{
							question: 'What happens when I click the Share Screen button?',
							answer:
								'Clicking the Share Screen button toggles screen sharing on or off for the call.'
						},
						{
							question: 'How do I end a call?',
							answer:
								'Click the End Call button to leave the call and navigate back to the lessons page.'
						}
					]
				}
			],
			admin: [
				{
					category: 'General',
					items: [
						{
							question: 'What is ClassConnect?',
							answer:
								'ClassConnect is an innovative educational platform designed to facilitate virtual learning through a 3D environment. It enables lecturers to teach using 3D annotations and models, providing a more interactive and immersive learning experience for students.'
						},
						{
							question: 'What motivated the creation of ClassConnect?',
							answer:
								'The motivation behind ClassConnect is to leverage recent advancements in virtual reality, 3D rendering, and streaming to create decentralized and innovative learning methods, extending beyond traditional physical classrooms.'
						}
					]
				},
				{
					category: 'User Enrollment',
					items: [
						{
							question: 'How do users sign up for ClassConnect?',
							answer:
								'Lecturers and students can sign up or be enrolled into an organization’s workspace by an administrator, who can create the organization, add users, and manage workspaces.'
						}
					]
				},
				{
					category: 'Schedule Lesson',
					items: [
						{
							question: 'What does the Schedule Lesson button do?',
							answer:
								'The Schedule Lesson button opens a modal where lecturers can enter details such as the topic, date, and time of the lesson. Upon submitting the form, the lesson is scheduled.'
						},
						{
							question: 'What information is required to schedule a lesson?',
							answer: 'To schedule a lesson, you need to provide the topic, date, and time.'
						},
						{
							question: 'How do I submit the scheduling form?',
							answer:
								'Fill in the required fields and click the Schedule button to submit the form. The form submission is handled by the handleSubmit function.'
						}
					]
				},
				{
					category: 'Study Material',
					items: [
						{
							question: 'What does the Upload button do?',
							answer:
								'The Upload button opens a modal where lecturers can upload study materials by providing a title, description, and selecting a file to upload.'
						},
						{
							question: 'What information is required to upload study materials?',
							answer: 'You need to provide a title, description, and select a file to upload.'
						},
						{
							question: 'How do I submit the upload form?',
							answer:
								'Fill in the required fields and click the Upload File button to submit the form. The form submission is handled by the handleUpload function.'
						}
					]
				},
				{
					category: 'Lesson Overview & Management',
					items: [
						{
							question: 'What information is displayed in the lessons table?',
							answer:
								'The lessons table displays the topic, date, and time of each lesson. There are separate sections for In Session and Upcoming lessons.'
						},
						{
							question: 'How can I join a lesson?',
							answer:
								"Click the Join button next to the lesson you want to join. This button uses the goto function to navigate to the lesson's page."
						}
					]
				},
				{
					category: 'Tabs Functionality',
					items: [
						{
							question: 'What are the different tabs available?',
							answer:
								'There are three tabs: Overview, Study Material Upload, and 3D Material Upload. Each tab provides different functionalities and information.'
						},
						{
							question: 'What can I do in the Overview tab?',
							answer:
								'The Overview tab displays general information and statistics about lessons, students, and study materials.'
						},
						{
							question: 'What can I do in the Study Material Upload tab?',
							answer:
								'The Study Material Upload tab provides information about study materials and allows lecturers to upload new study materials.'
						},
						{
							question: 'How can I leave an online class?',
							answer:
								'Click the End Call button to leave the online class and navigate back to the lessons page.'
						},
						{
							question: 'What can I do in the 3D Material Upload tab?',
							answer:
								'The 3D Material Upload tab provides information about 3D materials and allows lecturers to upload new 3D materials.'
						}
					]
				},
				{
					category: 'Video & Audio Management',
					items: [
						{
							question: 'How do I manage audio and video during a call?',
							answer:
								'You can use the buttons provided to toggle the microphone, camera, and screen sharing. You can also end the call using the End Call button.'
						},
						{
							question: 'What happens when I click the Mic button?',
							answer: 'Clicking the Mic button toggles the microphone on or off for the call.'
						},
						{
							question: 'What happens when I click the Camera button?',
							answer: 'Clicking the Camera button toggles the camera on or off for the call.'
						},
						{
							question: 'What happens when I click the Share Screen button?',
							answer:
								'Clicking the Share Screen button toggles screen sharing on or off for the call.'
						},
						{
							question: 'How do I end a call?',
							answer:
								'Click the End Call button to leave the call and navigate back to the lessons page.'
						}
					]
				}
			]
		};
		const role: string = locals.user.role;
		const ret_faq = (faq as any)[role];

		return {
			faq: ret_faq
		};
	}
}
