import { MemoryRouter } from 'react-router-dom';
import '../support/commands';
import Header from '../../client/src/components/Header';

import { CurrentUserContext } from '../../client/src/utils/context';

describe('<Header/>', () => {
    beforeEach((() => {
        cy.mount(
            <MemoryRouter>
                <CurrentUserContext.Provider value={{ currentUser: null, setCurrentUser: () => { } }}>
                    <Header />
                </CurrentUserContext.Provider>
            </MemoryRouter>
        )
    }));

    it('should render the header', () => {
        cy.get('#nav-title').should('have.text', 'Notebook');
        cy.get('#nav-login').should('have.text', 'Login');
    });
})