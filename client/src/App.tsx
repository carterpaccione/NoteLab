import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { UserContextInterface, UserContext } from './utils/userContext';

import Header from './components/Header';

import './styles/main.css';


const App: React.FC = () => {
  const localToken = localStorage.getItem("token");
  const localUser = localStorage.getItem("user");

  const [user, setUser] = useState<UserContextInterface | null>(null);

  useEffect(() => {
    if (localToken && localUser) {
      setUser({ token: localToken, user: JSON.parse(localUser), setUser: setUser });
    }
  }, [localToken, localUser]);

  return (
    <UserContext.Provider value={{ token: user?.token ?? '', user: user?.user ?? null, setUser: setUser }}>
      <Header />
      <div>
        <Outlet />
      </div>
    </ UserContext.Provider>
  );
}

export default App;
