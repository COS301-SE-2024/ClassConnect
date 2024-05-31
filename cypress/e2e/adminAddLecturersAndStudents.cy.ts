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

  it("should login as administrator", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(adminCredentials.email);
    cy.get('input[name="password"]').type(adminCredentials.password);
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, Admin");
  });

  it("should navigate to the organization management page", () => {
    cy.visit("/dashboard");
    cy.contains("Manage Organization").click();

    cy.url().should("include", "/organizations");
    cy.contains(organizationData.name).click();
  });

  it("should add a lecturer to an organization", () => {
    cy.visit("/organizations");
    cy.contains(organizationData.name).click();
    cy.contains("Add Lecturer").click();

    cy.get('input[name="email"]').type(lecturerData.email);
    cy.get('input[name="name"]').type(lecturerData.name);
    cy.get('input[name="password"]').type(lecturerData.password);
    cy.get('button[type="submit"]').click();

    cy.contains("Lecturer added successfully").should("exist");
    cy.contains(lecturerData.name).should("exist");
  });

  it("should add a student to an organization", () => {
    cy.visit("/organizations");
    cy.contains(organizationData.name).click();
    cy.contains("Add Student").click();

    cy.get('input[name="email"]').type(studentData.email);
    cy.get('input[name="name"]').type(studentData.name);
    cy.get('input[name="password"]').type(studentData.password);
    cy.get('button[type="submit"]').click();

    cy.contains("Student added successfully").should("exist");
    cy.contains(studentData.name).should("exist");
  });
});
