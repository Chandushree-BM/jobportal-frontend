import { createContext, useContext } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)
