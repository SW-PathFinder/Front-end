import { createContext, PropsWithChildren, useContext, useState } from "react";

interface AuthContextType {
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
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
    <AuthContext value={{ userId, login, logout }}>{children}</AuthContext>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within AuthProvider");

  return context;
};
