describe('Students page', () => {
	it('displays the heading', () => {
		cy.visit('http://localhost:5173/students');
		cy.get('h2').contains('Students').should('be.visible');
	});

	it('displays the button', () => {
		cy.visit('http://localhost:5173/students');
		cy.get('button').should('be.visible');
	});

	it('displays the search input', () => {
		cy.visit('http://localhost:5173/students');
		cy.get('input[type="text"]').should('be.visible');
	});
});
