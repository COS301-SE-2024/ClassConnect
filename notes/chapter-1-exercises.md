## Chapter Review Questions
1. Below are five definitions of software engineering including the one given in the textbook, listed chronologically. The similarities and differences are shown in Figure 1.1:
    * **IEEE.** The IEEE Computer Society defines software engineering as: "(1)
     The application of a systematic, disciplined, quantifiable approach to the
     development, operation, and maintenance of software; that is, the
     application of engineering of software. (2) The study of approaches as in
     (1)" ("IEEE Standard Glossary of Software Engineering Terminology," IEEE
     std 610.12-1990, 1990.)
    * **Ghezzi.** "Software engineering is the field of computer science that
      deals with the building of software systems that are so large or so
      complex that they are built by a team or teams of engineers.". It is the
      "application of engineering to software." (Carlo, Ghezzi, Mehdi Jazayeri
      and Dino Mandrioli, "Fundamentals of Software Engineering," 2nd Edition,
      Prentice Hall, 2003.)
    * **Brugge and Dutoit.** Software engineering is a modelling,
      problem-solving, knowledge acquisition, and rational-driven activity.
      (Bernd Brugge and Allen H. Dutoit, "Object-Oriented Software Engineering
      Using UML, Patterns, and Java," 3rd Edition, Prentice Hall, 2010)
    * **Sommerville.** "Software engineering is an engineering discipline that
      is concerned with all aspects of software production from early stages of
      system specification through to maintaining the system after it has gone
      into use." (Ian Sommerville, "Software Engineering", 9th Edition,
      Addision-Wesley, 2011.)
    * **Kung.** "Software engineering as a discipline is focused on the
      research, education, and application of engineering processes and methods
      to significantly increase software productivity and software quality while
      reducing software costs and time to market." (David Kung, "Object-Oriented
      Software Engineering: An Agile Unified Methodology," McGraw-Hill Higher
      Education, 2013.)
    Software engineering is crucial as software pervades every sector of
    society. Companies heavily depend on software to manage and expande their
    operations. With systems growing in size and complexity, software costs have
    surged to 90-95% of total system costs, emphasising the need for efficient
    development. Embedded systems, once reliant on specialised hardware, now
    demand skilled engineers to design, code, test and maintain millions of
    lines of source code. The collaboration effort of a software engineering
    team becomes indispensable in tackling critical systems and producing
    high-quality software. The intricate nature of large projects, illustrated
    by the analogy of blind men perceiving an elephant differently, highlights
    the importance of establishing a common understanding through modeling
    techniques. Software engineering provides a unified language and
    methodology, allowing teams to exchange ideas, coordinate efforts and
    integrate components seamlessly. In a world where timely system development
    is imperative, software engineering ensures effective collaboration and
    communication, preventing the long waits that businesses cannot afford.
![[figure-1.1.png]]

2. A software development process transforms the initial system concept into the operational system running in the target environment. It identifies the business needs, conducts a feasibility study and formulates the requirements or capabilities that the system must deliver. It also designs, implements, tests and deploys the system to the target environment.
3. Software quality assurance ensures that the development activities are performed properly and the software artefacts produced by the development activities meet the software requirements and desired quality standards.
4. Software project management oversees the control and administrations of the development and software quality assurance activities. Project management activities include effort estimations, project planning and scheduling, risk management and project administrations among others. These activities ensure that the software system is delivered on time and within budget.
5. Software configuration management. During the development process, numerous software artifacts are produced. These include requirements specification, software design code, test cases, user's manual and the like. These compose the software, or part of it, under different stages of the development process. For example, the requirements sepcification is the software in its non-executable form. The design specification is a refinement of the requirements specifications. The code is a refinement of the desing. These  documents depend on each other. For example, software design depends on the requirements. If the requirements are changed, the desing has to change. This in turn may require change to the code that implements the desing. Therefore, software engineering needs a mechanism to coordinate so that changes are made consistently.
6. The main difference between conventional software engineering and OO software engineering is paradigm shift — that is, how they view the world and systems. Because of this, they differ in the basic concepts, basic building blocks and starting point for the conceptualization, design and implementation of software systems. These in turn effect software quality assurance, project management (for example, effort estimation and planning), and software configuration management.
7. Software engineering and computer science are distinct disciplines, with computer science focusing on theoretical aspects like algorithms, data structures and computational efficency, while software engineering applies these concepts to practical solutions. Software engineering emphasizes efficient development methodologies, user interface design and business analysis. Despite differences, the two are closely related, with software engineering being the application of computer science. However, software engineering has its own research areas, including software processes and validation techniques, aiming to enhance the software quality. Both fields are essential and complement each other and it's challenging to have one without the other.
## Exercises
2. The functions of software development process, software quality assurance software project management and software configuration management are all discussed in the chapter review questions. All of software development process, software quality assurance, project management and software configuration management contribute to PQCT. In particular, good software development practices would apply well-established software development methodologies, software design principles, software design patterns, coding standards, test-driven development. These could lead to improvement of software productivity and software quality while at the same time reduce software costs and time to market. SQA ensures that the software meets the requirements and quality standards. It contributes to improvement of software quality. This in turn reduces rework and field-detected bugs; and hence, it also improves software productivity, reduces costs associated with rework and fixing field-detected bugs. Software project management ensures proper planning and administration of the software project. In particular, it should request the needed resources to develop the software system, properly schedule the development activities and SQA activities, manage budget and risks. These indirectly contribute to improvement of software productivity and software quality. Proper planning and administration of development and SQA activities directly contribute to reducing software development costs and time to market. This is because these activities could be performed smoothly, e.g., the needed components and resources are in place. SCM supports project management, SQA and software development process. It ensures that components of the software system are constructed and modified consistently and cost-effectively. Consistent modification implies productivity and quality, and cost-effectiveness implies reduction in cost and time to market.
3. The answer to this question may depend on the interpretation of “optimisation.” If it is about “optimisation of software PQCT,” then it is the focus of software engineering. If it is about performance optimization, then it should not be a focus, although SE also considers performance issues such as testing for performance. The database access example discussed in Section 1.5 is a practical example. Optimization could be a focus for a given project. For example, the construction of a compiler for multicore computers. In this case, it depends on whether the project is classified as a software engineering, or a computer science project. It might be an SE project. For example, it is constructed for a certain application. (See solution to Exercise 1.6 for more on optimisation and SE.)

