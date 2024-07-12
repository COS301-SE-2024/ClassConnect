describe('Tutorial Test Graph Component', () => {
  beforeEach(() => {
    cy.visit('/path-to-your-component-page');
  });

  it('should render the card with the correct title', () => {
    cy.get('p').contains('Tutorial Test Graph').should('be.visible');
  });

  it('should render the chart with correct data', () => {
    cy.get('canvas').should('be.visible');
  });

  it('should render the buttons with correct text', () => {
    cy.get('button').contains('Last week').should('be.visible');
    cy.get('button').contains('View full report').should('be.visible');
    cy.get('button').contains('Edit existing report').should('be.visible');
  });

  it('should display dropdown options on button click', () => {
    cy.get('button').contains('Last week').click();
    cy.get('li').contains('Yesterday').should('be.visible');
    cy.get('li').contains('Today').should('be.visible');
    cy.get('li').contains('Last 7 days').should('be.visible');
    cy.get('li').contains('Last 30 days').should('be.visible');
    cy.get('li').contains('Last 90 days').should('be.visible');
  });

  it('should navigate to the correct URL when "View full report" button is clicked', () => {
    cy.get('button').contains('View full report').click();
    cy.url().should('include', '/');
  });

  it('should navigate to the correct URL when "Edit existing report" button is clicked', () => {
    cy.get('button').contains('Edit existing report').click();
    cy.url().should('include', '/');
  });
});
