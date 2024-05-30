describe("Administrator Adds Lecturers and Students", () => {
  const adminCredentials = {
    email: "admin@example.com",
    password: "adminpassword",
  };

  const organizationData = {
    name: "Test Organization",
    description: "This is a test organization",
  };

  const lecturerData = {
    email: "lecturer@example.com",
    name: "Lecturer Name",
    password: "lecturerpassword",
  };

  const studentData = {
    email: "student@example.com",
    name: "Student Name",
    password: "studentpassword",
  };

  beforeEach(() => {
    cy.request("POST", "/api/login", {
      email: adminCredentials.email,
      password: adminCredentials.password,
    }).then((response) => {
      expect(response.status).to.eq(200);
      window.localStorage.setItem("authToken", response.body.token);
    });
  });
});
