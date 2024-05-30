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
});
