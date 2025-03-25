import { MemoryRouter } from 'react-router-dom';
import '../support/commands';

import NoteComponent from '../../client/src/components/NoteComponent';
import { Note, Importance_Level } from '../../client/src/models/dataModels';

describe('<NoteComponent/>', () => {
    let notesData: Note[];
    function mockHandleRefetch() {
        console.log('Refetching notes...');
    }

    beforeEach(() => {
        cy.fixture('notes.json').then((data) => {
            notesData = data.notes.map((note: Note) => ({
                ...note,
                importance: Importance_Level[note.importance as unknown as keyof typeof Importance_Level],
                createdAt: new Date(Date.now())
            }))
        })
    })

    context('Basic Rendering', () => {
        it('should render the passed MAIN note content', () => {
            cy.mount(
                <MemoryRouter>
                    <NoteComponent note={notesData[0]} handleRefetch={mockHandleRefetch} />
                </MemoryRouter>
            )
            cy.get('[data-cy="note-header"]').children().eq(1).should('have.text', notesData[0].createdAt.toLocaleDateString());
            cy.get('[data-cy="note-content"]').should('have.text', notesData[0].content);
        })

        it('should render the passed STICKY note content', () => {
            cy.mount(
                <MemoryRouter>
                    <NoteComponent note={notesData[2]} handleRefetch={mockHandleRefetch} />
                </MemoryRouter>
            )
            cy.get('[data-cy="note-header"]').children().eq(1).should('have.text', notesData[2].createdAt.toLocaleDateString());
            cy.get('[data-cy="note-content"]').should('have.text', notesData[2].content);
        });

        it('should render the correct NoteForm when the edit button is clicked', () => {
            cy.mount(
                <MemoryRouter>
                    <NoteComponent note={notesData[0]} handleRefetch={mockHandleRefetch} />
                </MemoryRouter>
            )
            cy.get('[data-cy="edit-note-button"]').should('exist').click();
            cy.get('[data-cy="note-form-importance"]').children().eq(0).should('have.value', notesData[0].importance.toString());
            cy.get('[data-cy="note-form-content"]').should('have.value', notesData[0].content);
        })

        it('should render the correct NoteForm inputs MAIN', () => {
            cy.mount(
                <MemoryRouter>
                    <NoteComponent note={notesData[0]} handleRefetch={mockHandleRefetch} />
                </MemoryRouter>
            )
            cy.get('[data-cy="edit-note-button"]').should('exist').click();
            cy.get('[data-cy="note-form-importance"]').should('have.value', 'Main').select('Highlight').should('have.value', 'Highlight');
            cy.get('[data-cy="note-form-content"]').clear().type('Updated note content').should('have.value', 'Updated note content');
        })

        it('should render the correct NoteForm inputs STICKY', () => {
            cy.mount(
                <MemoryRouter>
                    <NoteComponent note={notesData[2]} handleRefetch={mockHandleRefetch} />
                </MemoryRouter>
            )
            cy.get('[data-cy="edit-note-button"]').should('exist').click();
            cy.get('[data-cy="note-form-importance"]').should('have.value', 'Sticky').select('Main').should('have.value', 'Main');
            cy.get('[data-cy="note-form-content"]').clear().type('Updated note content').should('have.value', 'Updated note content');
        })
    })
});