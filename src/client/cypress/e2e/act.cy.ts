describe('Activities page', () => {
    it('displays the heading', () => {
      cy.visit('http://localhost:5173/activities');
      cy.get('h1').contains('Activities').should('be.visible');
    });
  
    const activities = [
      'Budget Planning Meeting',
      'Faculty Evaluation',
      'Student Affairs Committee',
      'Campus Safety Review',
      'Strategic Planning Workshop',
      'Alumni Networking Event'
    ];
  
    activities.forEach((activity) => {
      it(`displays the activity: ${activity}`, () => {
        cy.visit('http://localhost:5173/activities');
        cy.contains(activity).should('be.visible');
      });
    });
  });