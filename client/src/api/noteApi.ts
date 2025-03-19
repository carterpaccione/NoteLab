const createNote = async (notebookId: number, content: string, _importance: string, token: string) => {
    try {
        const response = await fetch(`/api/notes`, {
            method: 'POST',
            body: JSON.stringify({ notebook_id: notebookId, content: content, importance: _importance }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error("Error creating note: " + data.message);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

const deleteNote = async (noteId: number, token: string) => {
    try {
        const response = await fetch(`/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error("Error deleting note: " + data.message);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

const updateNote = async (noteId: number, content: string, importance: string, token: string) => {
    try {
        const response = await fetch(`/api/notes/${noteId}`, {
            method: 'PUT',
            body: JSON.stringify({ content: content, importance: importance }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error("Error updating note: " + data.message);
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}

export { createNote, deleteNote, updateNote };