import { createContext, useContext } from 'react';
import { UserToken } from './auth';

export interface UserContextInterface {
  token: string | null,
  user: UserToken | null
  setUser: React.Dispatch<React.SetStateAction<UserContextInterface | null>>;
}

export const UserContext = createContext<UserContextInterface | null>(null);

export function useUserContext() {
    const user = useContext(UserContext);
    if (user === null) {
        throw new Error('useUserContext must be used within a UserContext.Provider');
    }

    return user;
};