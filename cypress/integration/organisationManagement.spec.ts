// cypress/integration/organisationManagement.spec.ts

describe('Organisation Management Integration Tests with Mocking', () => {
    const baseUrl = 'http://localhost:3000/'; // Replace with the actual base URL of your API
  
    // Example data for creating an organisation
    const exampleOrganisationData = {
      id: '1',
      name: 'Organisation 1',
      description: 'A sample organisation',
      createdBy: 'user123'
    };
  
    const updatedOrganisationData = {
      id: '1',
      name: 'Updated Organisation 1',
      description: 'An updated sample organisation',
      createdBy: 'user123'
    };
  
    // Intercept the requests and provide mock responses
    beforeEach(() => {
      // Mock the POST request to create a new organisation
      cy.intercept('POST', `${baseUrl}/organisations`, {
        statusCode: 201,
        body: exampleOrganisationData
      }).as('createOrganisation');
  
      // Mock the GET request to fetch the created organisation by ID
      cy.intercept('GET', `${baseUrl}/organisations/${exampleOrganisationData.id}`, {
        statusCode: 200,
        body: exampleOrganisationData
      }).as('getOrganisation');
  
      // Mock the PUT request to update the organisation
      cy.intercept('PUT', `${baseUrl}/organisations/${exampleOrganisationData.id}`, {
        statusCode: 200,
        body: updatedOrganisationData
      }).as('updateOrganisation');
  
      // Mock the DELETE request to delete the organisation
      cy.intercept('DELETE', `${baseUrl}/organisations/${exampleOrganisationData.id}`, {
        statusCode: 204
      }).as('deleteOrganisation');
  
      // Mock the GET request after deletion to return 404
      cy.intercept('GET', `${baseUrl}/organisations/${exampleOrganisationData.id}`, {
        statusCode: 404
      }).as('getOrganisationAfterDelete');
    });
  
    // CREATE
    it('should create a new organisation', () => {
      cy.request('POST', `${baseUrl}/organisations`, exampleOrganisationData)
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.deep.equal(exampleOrganisationData);
        });
    });
  
    // READ
    it('should fetch the created organisation by ID', () => {
      cy.request('GET', `${baseUrl}/organisations/${exampleOrganisationData.id}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(exampleOrganisationData);
        });
    });
  
    // UPDATE
    it('should update the organisation details', () => {
      cy.request('PUT', `${baseUrl}/organisations/${exampleOrganisationData.id}`, updatedOrganisationData)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(updatedOrganisationData);
        });
  
      // Verify the update
      cy.request('GET', `${baseUrl}/organisations/${exampleOrganisationData.id}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(updatedOrganisationData);
        });
    });
  
    // DELETE
    it('should delete the created organisation', () => {
      cy.request('DELETE', `${baseUrl}/organisations/${exampleOrganisationData.id}`)
        .then((response) => {
          expect(response.status).to.eq(204);
        });
  
      // Verify the deletion
      cy.request({
        method: 'GET',
        url: `${baseUrl}/organisations/${exampleOrganisationData.id}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });