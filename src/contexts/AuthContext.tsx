import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useSocket, useSocketRequest } from "@/contexts/SocketContext";

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const socket = useSocket();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false);

  const setUserName = useSocketRequest("set_username", "username_result");

  const logout = useCallback(() => {
    socket.disconnect();
    socket.connect();
    localStorage.removeItem("userId");
    setUserId(null);
  }, [socket]);

  const login = useCallback(
    async (userId: string) => {
      setIsLoading(true);

      try {
        await setUserName({ username: userId });
        localStorage.setItem("userId", userId);
        setUserId(userId);
      } finally {
        setIsLoading(false);
      }
    },
    [setUserName],
  );

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (userId || !storedId) {
      setIsLoading(false);
      return;
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    console.log("Attempting to login with stored userId:", storedId);

    login(storedId)
      .catch((error) => {
        console.error("Login error:", error);
        logout();
      })
      .finally(() => {
        isFetchingRef.current = false;
      });
  }, [userId, login, logout]);

  return (
    <AuthContext value={{ userId, isLoading, login, logout }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within AuthProvider");

  return context;
};
