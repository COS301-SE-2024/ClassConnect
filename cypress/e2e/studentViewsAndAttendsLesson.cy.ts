describe("Student views and attends lessons", () => {
  const studentCredentials = {
    _id: "507f1f77bcf86cd799439021",
    name: "Jane",
    surname: "Smith",
    username: "janesmith",
    email: "student@example.com",
    password: "studentpassword",
    image: "https://example.com/profile.jpg",
    role: "student",
    organisations: ["507f1f77bcf86cd799439012"],
    workspaces: ["507f1f77bcf86cd799439013"],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-05-01T00:00:00Z",
  };

  const lessonData = {
    title: "Test Lesson",
    description: "This is a test lesson",
    schedule: "2024-06-01T10:00:00",
  };

  beforeEach(() => {
    // Assuming there is a login API endpoint for authentication
    cy.request("POST", "/api/login", {
      email: studentCredentials.email,
      password: studentCredentials.password,
    }).then((response) => {
      expect(response.status).to.eq(200);
      // Set the authentication token if needed
      window.localStorage.setItem("authToken", response.body.token);
    });
  });
});
