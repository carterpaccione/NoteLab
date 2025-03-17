describe('Notebook Page Test Suite', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
        cy.get('[data-cy="login-button"]').should('have.text', 'Login').click();
        cy.get('[data-cy="login-form"]').should('exist');
        cy.get('[name="username"]').type('TestUser');
        cy.get('[name="password"]').type('TestPassword');
        cy.get('[data-cy="submit-login-button"]').click();
        cy.get('#welcome-message-col').should('have.text', 'Welcome TestUser');
    });

    afterEach(() => {
        cy.get('#nav-logout').should('contain', 'Logout').click();
    });

    context('Notebook Workflow', () => {

        it('should create a notebook', () => {
            cy.get('[data-cy="add-notebook-button"]').as('addbtn').should('exist')
            cy.get('@addbtn').click();
            cy.get('[data-cy="new-notebook-form"]').should('exist');
            cy.get('[name="notebookTitle"]').type('Test Notebook');
            cy.get('[data-cy="submit-new-notebook"]').click();
            cy.get('[data-cy="notebook-tab-Test Notebook"]').should('contain', 'Test Notebook');
        })

        it('should edit a notebook title', () => {
            cy.get('[data-cy="edit-title-button-Test Notebook"]').should('exist').click();
            cy.get('[data-cy="edit-notebook-form"]').should('exist');
            cy.get('[name="newTitle"]').clear().type('Edited Notebook');
            cy.get('[data-cy="submit-new-notebook-title"]').click();
            cy.get('[data-cy="notebook-tab-Edited Notebook"]').should('exist').should('contain', 'Edited Notebook').click();
        })

        it('should create a note', () => {
            cy.get('[data-cy="notebook-tab-Edited Notebook"]').should('exist').should('contain', 'Edited Notebook').click();
            cy.get('[data-cy="create-note-button"]').should('exist').click();
            cy.get('[data-cy="note-form"]').should('exist');
            cy.get('[name="content"]').type('Test Note Content');
            cy.get('[data-cy="note-form-submit"]').click();
            cy.get('[data-cy="note-content"]').should('exist').should('contain', 'Test Note Content');
        })

        it('should edit the note content and importance', () => {
            cy.get('[data-cy="notebook-tab-Edited Notebook"]').should('exist').should('contain', 'Edited Notebook').click();
            cy.get('[data-cy="edit-note-button"]').should('exist').click();
            cy.get('[data-cy="update-note-form"]').should('exist');
            cy.get('[name="content"]').clear().type('Edited Note Content');
            cy.get('[data-cy="note-form-importance"]').select('Highlight');
            cy.get('[data-cy="submit-update-button"]').click();
            cy.get('[data-cy="note-content"]').should('exist').should('contain', 'Edited Note Content');
        })

        it('should delete the note', () => {
            cy.get('[data-cy="notebook-tab-Edited Notebook"]').should('exist').click();
            cy.get('[data-cy="delete-note-button"]').should('exist').click();
            cy.get('[data-cy="confirm-delete"]').should('exist').click();
            cy.get('[data-cy="note-content"]').should('not.exist');
        })

        it('should delete the notebook', () => {
            cy.get('[data-cy="notebook-tab-Edited Notebook"]').should('exist').click();
            cy.get('[data-cy="delete-notebook-button"]').should('exist').click();
            cy.get('[data-cy="confirm-delete"]').should('exist').click();
        })
    });

});