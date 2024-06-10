describe("Lecturer manipulates and annotates 3D environment", () => {
  const lecturerCredentials = {
    _id: "507f1f77bcf86cd799439011",
    name: "John",
    surname: "Doe",
    username: "johndoe",
    email: "lecturer@example.com",
    password: "lecturerpassword",
    image: "https://example.com/profile.jpg",
    role: "lecturer",
    organisations: ["507f1f77bcf86cd799439012"],
    workspaces: ["507f1f77bcf86cd799439013"],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-05-01T00:00:00Z",
  };

  const lessonData = {
    title: "Test Lesson",
    description: "This is a test lesson",
  };

  beforeEach(() => {
    // Assuming there is a login API endpoint for authentication
    cy.request("POST", "/api/login", {
      email: lecturerCredentials.email,
      password: lecturerCredentials.password,
    }).then((response) => {
      expect(response.status).to.eq(200);
      // Set the authentication token if needed
      window.localStorage.setItem("authToken", response.body.token);
    });
  });

  it("should log in as lecturer", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(lecturerCredentials.email);
    cy.get('input[name="password"]').type(lecturerCredentials.password);
    cy.get('button[type="submit"]').click();

    // Verify successful login
    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, John");
  });

  it("should navigate to the lesson with a 3D environment", () => {
    cy.visit("/dashboard");
    cy.contains("Manage Lessons").click();

    // Verify navigation
    cy.url().should("include", "/lessons");
    cy.contains(lessonData.title).click();
  });
});
