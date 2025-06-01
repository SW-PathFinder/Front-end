import { useState } from "react";

import { Outlet } from "react-router";

import { SessionProvider } from "@/contexts/SessionContext";

export const SessionLayout = () => {
  const [gameId, setGameId] = useState<string | null>(null);

  return (
    <SessionProvider value={{ gameId, setGameId }}>
      <Outlet />
    </SessionProvider>
  );
};
