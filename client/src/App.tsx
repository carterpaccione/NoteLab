import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from './components/Header';
import './styles/main.css';

import { CurrentUserContext } from './utils/context.js';
import AuthService, { UserToken } from './utils/auth.js';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState<UserToken | null>(null);

  useEffect(() => {
    const user = AuthService.getProfile();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <Header />
      <Outlet />
    </CurrentUserContext.Provider>
  );
}

export default App;
