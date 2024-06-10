import { expect } from "chai";

describe("Administrator Creates Organisation", () => {
  const adminCredentials = {
    email: "admin@example.com",
    password: "adminpassword",
  };

  const organizationData = {
    name: "Test Organisation",
    description: "This is a test organization",
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
    cy.test("/login");
    cy.get('input[name="email"]').type(adminCredentials.email);
    cy.get('input[name="password"]').type(adminCredentials.password);
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, Admin");
  });

  it("should navigate to the create organization page", () => {
    cy.visit("/dashboard");
    cy.contains("Create Organization").click();

    cy.url().should("include", "/create-organization");
    cy.contains("Create A New Organization");
  });

  it("should fill out and submit the create organization form", () => {
    cy.visit("/create-organization");
    cy.get('input[name="name"]').type(organizationData.name);
    cy.get('textarea[name="description"]').type(organizationData.description);
    cy.get('button[type="submit"]').click();

    cy.contains("Organization created successfully").should("exist");
    cy.url().should("include", "/organizations");
  });

  it("should list the newly created organization", () => {
    cy.visit("/organizations");

    cy.contains(organizationData.name).should("exist");
    cy.contains(organizationData.description).should("exist");
  });
});
