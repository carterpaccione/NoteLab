import { MemoryRouter } from 'react-router-dom';
import '../support/commands';
import Header from '../../client/src/components/Header';


describe('<Header/>', () => {
    beforeEach((() => {
        cy.mount(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        )
    }));

    it('should render the header', () => {
        cy.get('#nav-title').should('have.text', 'Notebook');
        cy.get('#nav-login').should('have.text', 'Login');
    });
})