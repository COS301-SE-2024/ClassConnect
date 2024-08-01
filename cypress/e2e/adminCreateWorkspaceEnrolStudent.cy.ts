describe("Adminstrator creates workspace and enrolls students", () => {
  const adminCredentials = {
    email: "admin@example.com",
    password: "adminpassword",
  };

  const organizationData = {
    name: "Test Organization",
    description: "This is a test organization",
  };

  const workspaceData = {
    name: "Test Workspace",
    description: "This is a test workspace",
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

  it("should log in as administrator", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(adminCredentials.email);
    cy.get('input[name="password"]').type(adminCredentials.password);
    cy.get('button[type="submit"]').click();

    // Verify successful login
    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, Admin");
  });

  it("should navigate to the organization management page", () => {
    cy.visit("/dashboard");
    cy.contains("Manage Organizations").click();

    // Verify navigation
    cy.url().should("include", "/organizations");
    cy.contains(organizationData.name).click();
  });

  it("should create a workspace for the organization", () => {
    cy.visit("/organizations");
    cy.contains(organizationData.name).click();
    cy.contains("Create Workspace").click();

    // Fill out the create workspace form
    cy.get('input[name="name"]').type(workspaceData.name);
    cy.get('textarea[name="description"]').type(workspaceData.description);
    cy.get('button[type="submit"]').click();

    // Verify that the workspace was created successfully
    cy.contains("Workspace created successfully").should("exist");
    cy.contains(workspaceData.name).should("exist");
  });

  it("should enroll a student into the workspace", () => {
    cy.visit("/organizations");
    cy.contains(organizationData.name).click();
    cy.contains(workspaceData.name).click();
    cy.contains("Enroll Students").click();

    // Enroll the student
    cy.get('input[name="email"]').type(studentData.email);
    cy.get('button[type="submit"]').click();

    // Verify that the student was enrolled successfully
    cy.contains("Student enrolled successfully").should("exist");
    cy.contains(studentData.email).should("exist");
  });
});
