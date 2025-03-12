import { MemoryRouter } from 'react-router-dom';
import '../support/commands';
import Header from '../../client/src/components/Header';


describe('Header', () => {
    it('should render the header', () => {
        cy.mount(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        cy.get('a').should('have.text', 'My App');
    });
})