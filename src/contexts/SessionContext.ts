import { createContext, Provider, useContext } from "react";

interface AuthenticatedContext {
  userId: string;
  capacity: number | null;
  setCapacity: (capacity: number | null) => void;
}

const AuthenticatedContext = createContext<AuthenticatedContext | null>(null);

export const AuthenticatedProvider =
  AuthenticatedContext as Provider<AuthenticatedContext>;

export const useAuthenticated = () => {
  const context = useContext(AuthenticatedContext);
  if (!context) {
    throw new Error("useGameSession must be used within a GameSessionProvider");
  }

  return context;
};
