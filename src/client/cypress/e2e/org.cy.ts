describe('Organisation page', () => {
  it('displays the heading', () => {
    cy.visit('http://localhost:5173/organisation');
    cy.get('h2').contains('Organisation').should('be.visible');
  });

  it('displays the button', () => {
    cy.visit('http://localhost:5173/organisation');
    cy.get('button').should('be.visible');
  });
});