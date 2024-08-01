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

  it("should log in as lecturer", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(lecturerCredentials.email);
    cy.get('input[name="password"]').type(lecturerCredentials.password);
    cy.get('button[type="submit"]').click();

    // Verify successful login
    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, John");
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

  it("should fill out and submit the add 3D model form", () => {
    cy.visit("/add-3d-model");

    cy.get('input[name="name"]').type(modelData.name);
    cy.get('input[name="url"]').type(modelData.url);
    cy.get('button[type="submit"]').click();

    // Verify that the 3D model was added successfully
    cy.contains("3D Model added successfully").should("exist");
    cy.url().should("include", "/lessons");
  });

  it("should list the newly added 3D model in the lesson", () => {
    cy.visit("/lessons");
    cy.contains(lessonData.title).click();

    // Verify that the new 3D model is listed under the lesson
    cy.contains(modelData.name).should("exist");
  });
});
