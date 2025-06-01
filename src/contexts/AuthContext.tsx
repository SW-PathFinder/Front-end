import { createContext } from "react";

interface AuthContextType {
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
