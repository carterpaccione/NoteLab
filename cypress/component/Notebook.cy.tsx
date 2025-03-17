import { MemoryRouter } from 'react-router-dom';
import '../support/commands';
import NotebookComponent from '../../client/src/components/NotebookComponent';
import { User, Notebook } from '../../client/src/models/dataModels';

describe('<NotebookComponent/>', () => {
    let userData: User;

    beforeEach(() => {
        cy.fixture('users.json').then((data) => {
            userData = {
                ...data,
                Notebooks: data.Notebooks.map((notebook: Notebook) => ({
                    ...notebook,
                    createdAt: new Date(Date.now()),
                    Notes: notebook.Notes.map((note) => {
                        return {
                            ...note,
                            createdAt: new Date(Date.now())
                        }
                    })
                }))
            }
        })

        cy.intercept('GET', '/api/users/1', (req) => {
            req.reply({ data: userData });
        });

        cy.intercept('GET', '/api/notebooks/1', (req) => {
            req.reply({ data: userData.Notebooks[0] });
        });

        cy.intercept('GET', '/api/notebooks/2', (req) => {
            req.reply({ data: userData.Notebooks[1] });
        });
    });

    context('Basic Rendering', () => {
        describe('NotebookTabs', () => {
            it('should render the correct NotebookTabs', () => {
                cy.mount(
                    <MemoryRouter>
                        <NotebookComponent user_id={userData.id} />
                    </MemoryRouter>
                )
                cy.get('#notebook-tabs-row').should('exist').children().should('have.length', userData.Notebooks.length + 1);
                cy.get('.notebook-tab').should('exist').children().eq(0).should('have.text', userData.Notebooks[0].title);
                cy.get('.notebook-tab').should('exist').children().eq(1).should('have.text', userData.Notebooks[1].title);
            })
        })
    })
})