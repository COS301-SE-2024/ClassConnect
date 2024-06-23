describe('User Management Integration Tests with Mocking', () => {
    const baseUrl = 'http://localhost:3000';
  
    const adminMockData = {
        id: "60d21b4667d0d8992e610c85",
        username: "a24125634",
        name: "John",
        surname: "Doe",
        email: "johndoe@admin.com",
        role: "admin",
        organisations: ["60d21b4967d0d8992e610c86"],
        workspaces: [],
        image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
    };

    const updateAdminMockData = {
        id: "60d21b4667d0d8992e610c85",
        username: "a24125634",
        name: "John",
        surname: "Adams",
        email: "johnadams@admin.com",
        role: "admin",
        organisations: ["60d21b4967d0d8992e610c86"],
        workspaces: [],
        image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-02T00:00:00.000Z"
    }

    const lecturerMockData = {
        id: "49d21b1267d0d8c92e890c85",
        username: "l24125634",
        name: "Neil",
        surname: "Harvey",
        email: "neilharvey@lecturer.com",
        role: "lecturer",
        organisations: ["60d21b4967d0d8992e610c86"],
        workspaces: ["32d12b9467d0d8992e612c70"],
        image: "https://images.ctfassets.net/h6goo9gw1hh6/35ESaRFvf7ka1qg429ihFI/f173abb985b59535e8eaa21fd31f227c/3-dating-a.jpg?w=1200&h=600&q=70&fm=webp",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
    }

    const updatedLecturerMockData = {
        id: "49d21b1267d0d8c92e890c85",
        username: "l24125634",
        name: "Joshua",
        surname: "Harvey",
        email: "joshuaharvey@lecturer.com",
        role: "lecturer",
        organisations: ["16d12b9476d0d9892e610c68"],
        workspaces: ["32d12b9467d0d8992e612c70"],
        image: "https://images.ctfassets.net/h6goo9gw1hh6/35ESaRFvf7ka1qg429ihFI/f173abb985b59535e8eaa21fd31f227c/3-dating-a.jpg?w=1200&h=600&q=70&fm=webp",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-02T00:00:00.000Z"
    }

    const studentMockData = {
        id: "21d21b1276d0d8b29e890x34",
        username: "s21026659",
        name: "Savanna",
        surname: "Schaefer",
        email: "savannaschaefer@student.com",
        role: "student",
        organisations: ["60d21b4967d0d8992e610c86"],
        workspaces: ["32d12b9467d0d8992e612c70"],
        image: "https://images.ctfassets.net/h6goo9gw1hh6/RVoyMWRwLWiYFOd2MTpPV/1055eaefb626e3a8ef9bac67f8e1e5e5/4-sm-a.jpg?w=1200&h=600&q=70&fm=webp",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
    }
  
    const updatedStudentMockData = {
        id: "21d21b1276d0d8b29e890x34",
        username: "s21026659",
        name: "Savanna",
        surname: "Schaefer",
        email: "savannaschaefer@student.com",
        role: "student",
        organisations: ["60d21b4967d0d8992e610c86"],
        workspaces: ["32d12b9467d0d8992e612c70"],
        image: "https://images.ctfassets.net/h6goo9gw1hh6/RVoyMWRwLWiYFOd2MTpPV/1055eaefb626e3a8ef9bac67f8e1e5e5/4-sm-a.jpg?w=1200&h=600&q=70&fm=webp",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
    }
  
    beforeEach(() => {
        // Mock the POST request to create a new user
        cy.intercept('POST', `${baseUrl}/users`, (req) => {
            if (req.body.role === 'admin') {
                req.reply({
                    statusCode: 201,
                    body: adminMockData
                });
            } else if (req.body.role === 'lecturer') {
                req.reply({
                    statusCode: 201,
                    body: lecturerMockData
                });
            } else if (req.body.role === 'student') {
                req.reply({
                    statusCode: 201,
                    body: studentMockData
                });
            }
        }).as('createUser');

        // Mock the GET request to fetch the created user by ID
        cy.intercept('GET', `${baseUrl}/users/*`, (req) => {
            if (req.url.includes(adminMockData.id)) {
                req.reply({
                    statusCode: 200,
                    body: adminMockData
                });
            } else if (req.url.includes(lecturerMockData.id)) {
                req.reply({
                    statusCode: 200,
                    body: lecturerMockData
                });
            } else if (req.url.includes(studentMockData.id)) {
                req.reply({
                    statusCode: 200,
                    body: studentMockData
                });
            }
        }).as('getUser');

        // Mock the PUT request to update the user
        cy.intercept('PUT', `${baseUrl}/users/*`, (req) => {
            if (req.body.role === 'admin') {
                req.reply({
                    statusCode: 200,
                    body: updateAdminMockData
                });
            } else if (req.body.role === 'lecturer') {
                req.reply({
                    statusCode: 200,
                    body: updatedLecturerMockData
                });
            } else if (req.body.role === 'student') {
                req.reply({
                    statusCode: 200,
                    body: updatedStudentMockData
                });
            }
        }).as('updateUser');

         // Mock the DELETE request to delete the user
        cy.intercept('DELETE', `${baseUrl}/users/*`, {
            statusCode: 204
        }).as('deleteUser');

        // Mock the GET request after deletion to return 404
        cy.intercept('GET', `${baseUrl}/users/*`, {
            statusCode: 404
        }).as('getUserAfterDelete');
    });

    // CREATE admin
    it('should create a new admin user', () => {
        cy.request('POST', `${baseUrl}/users`, adminMockData).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.deep.equal(adminMockData);
        });
    });

    // CREATE lecturer
    it('should create a new lecturer user', () => {
        cy.request('POST', `${baseUrl}/users`, lecturerMockData).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.deep.equal(lecturerMockData);
        });
    });

    //CREATE student
    it('should create a new student user', () => {
        cy.request('POST', `${baseUrl}/users`, studentMockData).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.deep.equal(studentMockData);
        });
    });
  
    // READ admin
    it('should fetch the created admin user by ID', () => {
        cy.request('GET', `${baseUrl}/users/${adminMockData.id}`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.deep.equal(adminMockData);
        });
    });

    //READ lecturer
    it('should fetch the created lecturer user by ID', () => {
        cy.request('GET', `${baseUrl}/users/${lecturerMockData.id}`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.deep.equal(lecturerMockData);
        });
    });

    //READ student
    it('should fetch the created student user by ID', () => {
        cy.request('GET', `${baseUrl}/users/${studentMockData.id}`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.deep.equal(studentMockData);
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