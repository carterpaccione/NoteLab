import { createContext, useContext } from "react";
import { UserToken } from '../utils/auth.js';

export type UserContextType = {
    currentUser: UserToken | null;
    setCurrentUser: (user: UserToken | null) => void;
}

export const CurrentUserContext = createContext<UserContextType | null>(null);

export const useCurrentUser = () => {
    const currentUserContext = useContext(CurrentUserContext);
    if (!currentUserContext) {
        console.error("useCurrentUser must be used within a CurrentUserProvider");
        return null;
    }
    return currentUserContext;
}