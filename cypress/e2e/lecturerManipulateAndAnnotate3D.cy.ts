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

  it("should perform transformations on 3D models", () => {
    cy.visit(`/lessons/${lessonData.title}`);

    // Assuming there are buttons or controls for 3D transformations
    cy.get("button.rotate-model").click();
    cy.get("button.scale-model").click();
    cy.get("button.transform-model").click();

    // Verify transformations - these verifications would depend on your specific implementation
    cy.get(".3d-model")
      .should("have.attr", "data-rotation", "90") // Example check for rotation
      .should("have.attr", "data-scale", "1.5") // Example check for scaling
      .should("have.attr", "data-transform", "translate(10px, 20px)"); // Example check for transform
  });

  it("should add annotations to the 3D environment", () => {
    cy.visit(`/lessons/${lessonData.title}`);

    // Assuming there is a button to add annotations
    cy.get("button.add-annotation").click();

    // Fill out the annotation form
    cy.get('textarea[name="annotation"]').type("This is a test annotation.");
    cy.get('button[type="submit"]').click();

    // Verify that the annotation was added
    cy.contains("This is a test annotation.").should("exist");
  });
});
