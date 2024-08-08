describe("Authentication Test", () => {
  const user = {
    email: "test@example.com",
    password: "password123",
  };

  it("should load the login page", () => {
    cy.visit("/login");
    cy.contains("Login");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
  });

  it("should register a new user", () => {
    cy.visit("register");
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('input[name="confirmPassword"]').type(user.password);
    cy.get('button[type="submit"]').click();

    cy.contains("Registration successful").should("exist");
  });

  it("should login with registered user", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button[type="submit"]').click();

    cy.contains("Login successful").should("exist");
    cy.url().should("inlcude", "/dashboard");
  });

  it("should login with wrong credentials", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.contains("Invalid credentials").should("exist");
  });
});
