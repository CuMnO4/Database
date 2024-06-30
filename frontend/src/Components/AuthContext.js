import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  const login = (name) => {
    setUsername(name);
  };

  return (
    <AuthContext.Provider value={{ username, login }}>
      {children}
    </AuthContext.Provider>
  );
};
