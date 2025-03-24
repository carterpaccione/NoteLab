import { MemoryRouter } from 'react-router-dom';
import '../support/commands';
import Login from '../../client/src/components/Login';

import { CurrentUserContext } from '../../client/src/utils/context';

describe('<Login/>', () => {
    beforeEach(() => {
        cy.mount(
            <MemoryRouter>
                <CurrentUserContext.Provider value={{ currentUser: null, setCurrentUser: () => { } }}>
                    <Login />
                </CurrentUserContext.Provider>
            </MemoryRouter>
        )
    });

    it('should render the login form', () => {
        cy.get('[data-cy="login-form"]').should('exist');
        cy.get('input[name="username"]').should('exist');
        cy.get('input[name="password"]').should('exist');
    });

    it('should display the correct labels and placeholders', () => {
        cy.get('[data-cy="label-username"]').should('have.text', 'Username');
        cy.get('input[name="username"]').should('have.attr', 'placeholder', 'Enter username');
        cy.get('[data-cy="label-password"]').should('have.text', 'Password');
        cy.get('input[name="password"]').should('have.attr', 'placeholder', 'Enter password');
    });

    it('should display the correct error message', () => {
        cy.get('[data-cy="error-message"]').should('not.exist');
        cy.get('#submit-login-button').should('exist');
        cy.get('#submit-login-button').click();
        cy.get('[data-cy="error-message"]').should('exist').and('have.text', 'Please enter a username and password');
    });
})