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
});
