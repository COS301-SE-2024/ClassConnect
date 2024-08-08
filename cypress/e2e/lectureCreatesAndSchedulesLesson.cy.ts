describe("Lecture creates and schedules lessons", () => {
  const lectureCredentials = {
    email: "lecturer@example.com",
    password: "lecturerpassword",
  };

  const lessonData = {
    title: "Test Lesson",
    description: "This is a test lesson",
    schedule: "2024-06-01T10:00:00",
  };

  beforeEach(() => {
    cy.request("POST", "/api/login", {
      email: lecturerCredentials.email,
      password: lecturerCredentials.password,
    }).then((response) => {
      expect(response.status).to.eq(200);
      window.localStorage.setItem("authToken", response.body.token);
    });
  });

  it("should log in as lecturer", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(lecturerCredentials.email);
    cy.get('input[name="password"]').type(lecturerCredentials.password);
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, Lecturer");
  });

  it("should navigate to the lesson creation page", () => {
    cy.visit("/dashboard");
    cy.contains("Create Lesson").click();

    cy.url().should("include", "/create-lesson");
    cy.contains("Create a New Lesson");
  });

  it("should fill out and submit the create lesson form", () => {
    cy.visit("/create-lesson");

    cy.get('input[name="title"]').type(lessonData.title);
    cy.get('textarea[name="description"]').type(lessonData.description);
    cy.get('input[name="schedule"]').type(lessonData.schedule);
    cy.get('button[type="submit"]').click();

    cy.contains("Lesson created successfully").should("exist");
    cy.url().should("include", "/lessons");
  });

  it("should list the newly created lesson", () => {
    cy.visit("/lessons");

    // Verify that the new lesson is listed
    cy.contains(lessonData.title).should("exist");
    cy.contains(lessonData.description).should("exist");
    cy.contains("Scheduled on " + lessonData.schedule).should("exist");
  });
});
