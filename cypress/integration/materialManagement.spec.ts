describe('Material Management Integration Tests with Mocking', () => {
    const baseUrl = 'http://localhost:3000';
  
    const lectureMaterialMockData = {
        id: "60d21b4c67d0d8992e610c87",
        type: true,
        workspace_id: "60d21b4c67d0d8992e610c87",
        lecturer_id: "49d21b1267d0d8c92e890c85",
        title: "Lecture Material - PDF",
        description: "Here is a Mock PDF",
        file_path: "string",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
    };

    const updatedLectureMaterialMockData = {
        id: "60d21b4c67d0d8992e610c87",
        type: false,
        workspace_id: "60d21b4c67d0d8992e610c87",
        lecturer_id: "49d21b1267d0d8c92e890c85",
        title: "Lecture Material - 3D Model",
        description: "Here is a Mock 3D Model",
        file_path: "string",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
    };
  
    // Intercept the requests and provide mock responses
    beforeEach(() => {
      // Mock the POST request to create new material
      cy.intercept('POST', `${baseUrl}/materials`, {
        statusCode: 201,
        body: lectureMaterialMockData
      }).as('createMaterial');
  
      // Mock the GET request to fetch the created material by ID
      cy.intercept('GET', `${baseUrl}/materials/${lectureMaterialMockData.id}`, {
        statusCode: 200,
        body: lectureMaterialMockData
      }).as('getMaterial');
  
      // Mock the PUT request to update the material
      cy.intercept('PUT', `${baseUrl}/materials/${lectureMaterialMockData.id}`, {
        statusCode: 200,
        body: updatedLectureMaterialMockData
      }).as('updateMaterial');
  
      // Mock the DELETE request to delete the material
      cy.intercept('DELETE', `${baseUrl}/materials/${lectureMaterialMockData.id}`, {
        statusCode: 204
      }).as('deleteMaterial');
  
      // Mock the GET request after deletion to return 404
      cy.intercept('GET', `${baseUrl}/materials/${lectureMaterialMockData.id}`, {
        statusCode: 404
      }).as('getMaterialAfterDelete');
    });
  
    // CREATE
    it('should create new material', () => {
      cy.request('POST', `${baseUrl}/materials`, lectureMaterialMockData)
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.deep.equal(lectureMaterialMockData);
        });
    });
  
    // READ
    it('should fetch the created material by ID', () => {
      cy.request('GET', `${baseUrl}/materials/${lectureMaterialMockData.id}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(lectureMaterialMockData);
        });
    });
  
    // UPDATE
    it('should update the material details', () => {
      cy.request('PUT', `${baseUrl}/materials/${lectureMaterialMockData.id}`, updatedLectureMaterialMockData)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(updatedLectureMaterialMockData);
        });
  
      // Verify the update
      cy.request('GET', `${baseUrl}/materials/${lectureMaterialMockData.id}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(updatedLectureMaterialMockData);
        });
    });
  
    // DELETE
    it('should delete the created material', () => {
      cy.request('DELETE', `${baseUrl}/materials/${lectureMaterialMockData.id}`)
        .then((response) => {
          expect(response.status).to.eq(204);
        });
  
      // Verify the deletion
      cy.request({
        method: 'GET',
        url: `${baseUrl}/materials/${lectureMaterialMockData.id}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });