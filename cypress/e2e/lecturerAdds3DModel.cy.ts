describe("Lecturer adds 3D models to lessons", () => {
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

  const modelData = {
    name: "Test 3D Model",
    url: "https://example.com/3d-model.glb",
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

  it("should navigate to the lesson management page", () => {
    cy.visit("/dashboard");
    cy.contains("Manage Lessons").click();

    // Verify navigation
    cy.url().should("include", "/lessons");
    cy.contains(lessonData.title).click();
  });

  it("should navigate to the add 3D model page", () => {
    cy.visit("/lessons");
    cy.contains(lessonData.title).click();
    cy.contains("Add 3D Model").click();

    // Verify navigation
    cy.url().should("include", "/add-3d-model");
    cy.contains("Add a New 3D Model");
  });
});
