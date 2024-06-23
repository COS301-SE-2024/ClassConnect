describe('User Management Integration Tests with Mocking', () => {
    const baseUrl = 'http://localhost:3000';
  
    const adminMockData = {
        id: "60d21b4667d0d8992e610c85",
        username: "a24125634",
        name: "John",
        surname: "johndoe@example.com",
        email: "johndoe@example.com",
        role: "admin",
        organisations: ["60d21b4967d0d8992e610c86"],
        workspaces: [],
        image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
    };
  
    const updatedUserData = {
      id: '1',
      name: 'Updated User 1',
      email: 'updateduser1@example.com',
      role: 'student'
    };
  
    // Intercept the requests and provide mock responses
    beforeEach(() => {
      // Mock the POST request to create a new user
      cy.intercept('POST', `${baseUrl}/users`, {
        statusCode: 201,
        body: exampleUserData
      }).as('createUser');
  
      // Mock the GET request to fetch the created user by ID
      cy.intercept('GET', `${baseUrl}/users/${exampleUserData.id}`, {
        statusCode: 200,
        body: exampleUserData
      }).as('getUser');
  
      // Mock the PUT request to update the user
      cy.intercept('PUT', `${baseUrl}/users/${exampleUserData.id}`, {
        statusCode: 200,
        body: updatedUserData
      }).as('updateUser');
  
      // Mock the DELETE request to delete the user
      cy.intercept('DELETE', `${baseUrl}/users/${exampleUserData.id}`, {
        statusCode: 204
      }).as('deleteUser');
  
      // Mock the GET request after deletion to return 404
      cy.intercept('GET', `${baseUrl}/users/${exampleUserData.id}`, {
        statusCode: 404
      }).as('getUserAfterDelete');
    });
  
    // CREATE
    it('should create a new user', () => {
      cy.request('POST', `${baseUrl}/users`, exampleUserData)
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.deep.equal(exampleUserData);
        });
    });
  
    // READ
    it('should fetch the created user by ID', () => {
      cy.request('GET', `${baseUrl}/users/${exampleUserData.id}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(exampleUserData);
        });
    });
  
    // UPDATE
    it('should update the user details', () => {
      cy.request('PUT', `${baseUrl}/users/${exampleUserData.id}`, updatedUserData)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(updatedUserData);
        });
  
      // Verify the update
      cy.request('GET', `${baseUrl}/users/${exampleUserData.id}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(updatedUserData);
        });
    });
  
    // DELETE
    it('should delete the created user', () => {
      cy.request('DELETE', `${baseUrl}/users/${exampleUserData.id}`)
        .then((response) => {
          expect(response.status).to.eq(204);
        });
  
      // Verify the deletion
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/${exampleUserData.id}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });