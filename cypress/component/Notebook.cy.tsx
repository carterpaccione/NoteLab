import { MemoryRouter } from 'react-router-dom';
import '../support/commands';
import NotebookContent from '../../client/src/components/NotebookContent';

import { CurrentUserContext } from '../../client/src/utils/context';

const mockUserToken = {
    username: 'testuser',
    id: 1,
    iat: 1629780000,
    exp: 1629780000
};

const mockHandleRefetch = () => {
    console.log(test)
}

describe('Basic Rendering', () => {
    before(() => {
        cy.window().then((win) => {
            win.localStorage.setItem('token', JSON.stringify(mockUserToken))
        });

        cy.fixture('notebook_fixture').as('notebookFixture').then((notebookFixture) => {
            cy.intercept('GET', '/api/notebooks/1', (req) => {
                req.reply({
                   data: notebookFixture
                })
            }).as('mockGetRequest')
        })
    })

    beforeEach(() => {
        cy.mount(
            <MemoryRouter>
                <CurrentUserContext.Provider value={{ currentUser: mockUserToken, setCurrentUser: () => { }}}>
                    <NotebookContent notebookId={1} handleRefetch={mockHandleRefetch} />
                </CurrentUserContext.Provider>
            </MemoryRouter>
        );
        cy.wait('@mockGetRequest');
    });

    it('should render the passed notebook content', () => {
        cy.get('#notebookpage-container').should('exist');
        cy.get('#note-content').first().should('have.text', 'test');
        cy.get('code').should('exist');
    })
})