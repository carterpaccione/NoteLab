const fetchNotebook = async (notebookId: number) => {
    try {
        const response = await fetch(`/api/notebooks/${notebookId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error("Error fetching notebook: " + data.message);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

const updateNotebookTitle = async (notebookId: number, title: string) => {
    try {
        const response = await fetch(`/api/notebooks/${notebookId}`, {
            method: 'PUT',
            body: JSON.stringify({ title: title}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Error editing notebook title: " + data.message);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

const deleteNotebook = async (notebookId: number) => {
    try {
        const response = await fetch(`/api/notebooks/${notebookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if(!response.ok) {
            throw new Error("Error deleting notebook: " + data.message);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

const createNotebook = async (userId: number, title: string) => {
    try {
        const response = await fetch(`/api/notebooks`, {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, title: title }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error("Error creating notebook: " + data.message);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

export { fetchNotebook, updateNotebookTitle, deleteNotebook, createNotebook };