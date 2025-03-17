describe('Landing Page Test Suite', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    })

    afterEach(() => {
        cy.get('#nav-logout').should('contain', 'Logout').click();
    })

    context('Sign Up User Workflow', () => {
        it('should sign up a user', () => {
            cy.get('[data-cy="signup-button"]').should('have.text', 'Sign Up').click();
            cy.get('[data-cy="signup-form"]').should('exist');
            cy.get('[name="email"]').type('TestUser@test.com');
            cy.get('[name="username"]').type('TestUser');
            cy.get('[name="password"]').type('TestPassword');
            cy.get('[name="confirmPassword"]').type('TestPassword');
            cy.get('[data-cy="signup-submit"]').click();
            cy.get('#welcome-message-col').should('have.text', 'Welcome TestUser');
        });
    })

    context('Login User Workflow', () => {
        it('should login a user', () => {
            cy.get('[data-cy="login-button"]').should('have.text', 'Login').click();
            cy.get('[data-cy="login-form"]').should('exist');
            cy.get('[name="username"]').type('TestUser');
            cy.get('[name="password"]').type('TestPassword');
            cy.get('[data-cy="submit-login-button"]').click();
            cy.get('#welcome-message-col').should('have.text', 'Welcome TestUser');
        });
    })

})