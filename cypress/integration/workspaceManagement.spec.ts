describe('Workspace Management Integration Tests with Mocking', () => {
    const baseUrl = 'http://localhost:3000';
  
    const workspaceMockData = {
      id: "60d21b4c67d0d8992e610c87",
      name: "Development",
      organisationId: "60d21b4967d0d8992e610c86",
      createdBy: "60d21b4667d0d8992e610c85",
      users: ["60d21b4667d0d8992e610c85"],
      image: "https://www.springboard.com/blog/wp-content/uploads/2022/06/coding-.png",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z"
    };
  
    const updatedWorkspaceMockData = {
      id: "60d21b4c67d0d8992e610c87",
      name: "COS301",
      organisationId: "60d21b4967d0d8992e610c86",
      createdBy: "60d21b4667d0d8992e610c85",
      users: ["60d21b4667d0d8992e610c85"],
      image: "https://wallpapers.com/images/hd/coding-background-9izlympnd0ovmpli.jpg",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z"
    };
  
    // Intercept the requests and provide mock responses
    beforeEach(() => {
      // Mock the POST request to create a new workspace
      cy.intercept('POST', `${baseUrl}/workspaces`, {
        statusCode: 201,
        body: workspaceMockData
      }).as('createWorkspace');
  
      // Mock the GET request to fetch the created workspace by ID
      cy.intercept('GET', `${baseUrl}/workspaces/${workspaceMockData.id}`, {
        statusCode: 200,
        body: workspaceMockData
      }).as('getWorkspace');
  
      // Mock the PUT request to update the workspace
      cy.intercept('PUT', `${baseUrl}/workspaces/${workspaceMockData.id}`, {
        statusCode: 200,
        body: updatedWorkspaceMockData
      }).as('updateWorkspace');
  
      // Mock the DELETE request to delete the workspace
      cy.intercept('DELETE', `${baseUrl}/workspaces/${workspaceMockData.id}`, {
        statusCode: 204
      }).as('deleteWorkspace');
  
      // Mock the GET request after deletion to return 404
      cy.intercept('GET', `${baseUrl}/workspaces/${workspaceMockData.id}`, {
        statusCode: 404
      }).as('getWorkspaceAfterDelete');
    });
  
    // CREATE
    it('should create a new workspace', () => {
      cy.request('POST', `${baseUrl}/workspaces`, workspaceMockData)
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.deep.equal(workspaceMockData);
        });
    });
  
    // READ
    it('should fetch the created workspace by ID', () => {
      cy.request('GET', `${baseUrl}/workspaces/${workspaceMockData.id}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(workspaceMockData);
        });
    });
  
    // UPDATE
    it('should update the workspace details', () => {
      cy.request('PUT', `${baseUrl}/workspaces/${workspaceMockData.id}`, updatedWorkspaceMockData)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(updatedWorkspaceMockData);
        });
  
      // Verify the update
      cy.request('GET', `${baseUrl}/workspaces/${workspaceMockData.id}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(updatedWorkspaceMockData);
        });
    });
  
    // DELETE
    it('should delete the created workspace', () => {
      cy.request('DELETE', `${baseUrl}/workspaces/${workspaceMockData.id}`)
        .then((response) => {
          expect(response.status).to.eq(204);
        });
  
      // Verify the deletion
      cy.request({
        method: 'GET',
        url: `${baseUrl}/workspaces/${workspaceMockData.id}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });