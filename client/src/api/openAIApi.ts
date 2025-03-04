const fetchProblemResponse = async (prompt: string) => {
    try {
        const response = await fetch(`/api/openai/hint`, {
            method: 'POST',
            body: JSON.stringify({ problem: prompt }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Error fetching problem response: " + data.message);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

const fetchSummaryResponse = async (prompt: string) => {
    try {
        const response = await fetch(`/api/openai/summary`, {
            method: 'POST',
            body: JSON.stringify({ prompt: prompt }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Error fetching summary response: " + data.message);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

export { fetchProblemResponse, fetchSummaryResponse };