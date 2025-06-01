import { useState, ReactNode } from "react";

import { AuthContext } from "@/contexts/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId"),
  );

  const login = (id: string) => {
    localStorage.setItem("userId", id);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
