const fetchSignUp = async (email: string, username: string, password: string) => {
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Error Signing Up: " + data.message);
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

const fetchLogin = async (username: string, password: string) => {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Error Logging In: " + data.message);
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

const fetchUserData = async (token: string) => {

    if (!token || token === '') {
        throw new Error("Unauthorized");
    }

    try {
        const response = await fetch(`/api/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Error Fetching User Data: " + data.message);
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
};

export { fetchSignUp, fetchLogin, fetchUserData };