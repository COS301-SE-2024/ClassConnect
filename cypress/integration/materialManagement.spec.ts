describe('Material Management Integration Tests with Mocking', () => {
    const baseUrl = 'http://localhost:3000';
  
    const pdfLectureMaterialMockData = {
        _id: "60d21b4c67d0d8992e610c87",
        type: true,
        workspace_id: "60d21b4c67d0d8992e610c87",
        lecturer_id: "49d21b1267d0d8c92e890c85",
        title: "Lecture Material",
        description: "Here is a Mock Pdf",
        file_path: "string",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
    };
  
    const updatedMaterialData = {
      id: '1',
      title: 'Updated Material 1',
      description: 'An updated sample material',
      url: 'http://example.com/updated-material1',
      courseId: 'CS101'
    };
  
    // Intercept the requests and provide mock responses
    beforeEach(() => {
      // Mock the POST request to create new material
      cy.intercept('POST', `${baseUrl}/materials`, {
        statusCode: 201,
        body: exampleMaterialData
      }).as('createMaterial');
  
      // Mock the GET request to fetch the created material by ID
      cy.intercept('GET', `${baseUrl}/materials/${exampleMaterialData.id}`, {
        statusCode: 200,
        body: exampleMaterialData
      }).as('getMaterial');
  
      // Mock the PUT request to update the material
      cy.intercept('PUT', `${baseUrl}/materials/${exampleMaterialData.id}`, {
        statusCode: 200,
        body: updatedMaterialData
      }).as('updateMaterial');
  
      // Mock the DELETE request to delete the material
      cy.intercept('DELETE', `${baseUrl}/materials/${exampleMaterialData.id}`, {
        statusCode: 204
      }).as('deleteMaterial');
  
      // Mock the GET request after deletion to return 404
      cy.intercept('GET', `${baseUrl}/materials/${exampleMaterialData.id}`, {
        statusCode: 404
      }).as('getMaterialAfterDelete');
    });
  
    // CREATE
    it('should create new material', () => {
      cy.request('POST', `${baseUrl}/materials`, exampleMaterialData)
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.deep.equal(exampleMaterialData);
        });
    });
  
    // READ
    it('should fetch the created material by ID', () => {
      cy.request('GET', `${baseUrl}/materials/${exampleMaterialData.id}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(exampleMaterialData);
        });
    });
  
    // UPDATE
    it('should update the material details', () => {
      cy.request('PUT', `${baseUrl}/materials/${exampleMaterialData.id}`, updatedMaterialData)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(updatedMaterialData);
        });
  
      // Verify the update
      cy.request('GET', `${baseUrl}/materials/${exampleMaterialData.id}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal(updatedMaterialData);
        });
    });
  
    // DELETE
    it('should delete the created material', () => {
      cy.request('DELETE', `${baseUrl}/materials/${exampleMaterialData.id}`)
        .then((response) => {
          expect(response.status).to.eq(204);
        });
  
      // Verify the deletion
      cy.request({
        method: 'GET',
        url: `${baseUrl}/materials/${exampleMaterialData.id}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });