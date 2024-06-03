describe('Lecturers page', () => {
it('displays the heading', () => {
    cy.visit('http://localhost:5173/lecturers');
    cy.get('h2').contains('Lecturers').should('be.visible');
});

it('displays the button', () => {
    cy.visit('http://localhost:5173/lecturers');
    cy.get('button').should('be.visible');
});

it('displays the search input', () => {
    cy.visit('http://localhost:5173/lecturers');
    cy.get('input[type="text"]').should('be.visible');
});
});