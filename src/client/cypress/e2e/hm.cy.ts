describe('Degree Dashboard page', () => {
    it('displays the heading', () => {
      cy.visit('http://localhost:5173');
      cy.get('h1').contains('Degree Dashboard').should('be.visible');
    });
  
    const degrees = [
      'BEng Mechanical Engineering',
      'BEng Electrical Engineering',
      'BEng Civil Engineering',
      'BSc Computer Science',
      'BEng Chemical Engineering',
      'BSc Information Technology',
      'MEng Industrial Engineering',
      'MEng Mechanical Engineering',
      'MEng Electrical Engineering',
      'MSc Computer Science',
      'PhD Civil Engineering',
      'PhD Information Technology'
    ];
  
    degrees.forEach((degree) => {
      it(`displays the degree: ${degree}`, () => {
        cy.visit('http://localhost:5173');
        cy.contains(degree).should('be.visible');
      });
    });
  });