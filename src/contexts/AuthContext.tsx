import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSocketRequest } from "@/contexts/SocketContext";

interface AuthContextType {
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const setUserName = useSocketRequest("set_username", "username_result");

  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId"),
  );

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (!stored) return;

    (async () => {
      try {
        await setUserName({ username: stored });
        setUserId(stored);
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as { message?: unknown }).message === "string" &&
          (err as { message: string }).message !==
            "이미 사용 중인 사용자 이름입니다."
        ) {
          localStorage.removeItem("userId");
          setUserId(null);
        }
      }
    })();
  }, [setUserName]);

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
