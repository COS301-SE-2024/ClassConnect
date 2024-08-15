describe('Admins page', () => {
	it('displays the heading', () => {
		cy.visit('http://localhost:5173/admin/admins');
		cy.get('h2').contains('Admins').should('be.visible');
	});

	it('displays the button', () => {
		cy.visit('http://localhost:5173/admin/admins');
		cy.get('button').should('be.visible');
	});

	it('displays the search input', () => {
		cy.visit('http://localhost:5173/admin/admins');
		cy.get('input[type="text"]').should('be.visible');
	});
});
