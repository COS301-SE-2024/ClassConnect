describe('Announcements page', () => {
	it('displays the heading', () => {
		cy.visit('http://localhost:5173/admin/announcements');
		cy.get('h1').contains('Announcements').should('be.visible');
	});

	const announcements = ['Campus Safety Drill', 'New Library Hours', 'Guest Lecture Series'];

	announcements.forEach((announcement) => {
		it(`displays the announcement: ${announcement}`, () => {
			cy.visit('http://localhost:5173/admin/announcements');
			cy.contains(announcement).should('be.visible');
		});
	});
});
