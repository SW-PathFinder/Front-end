import { useState } from "react";

import { Outlet } from "react-router";

import { SessionProvider } from "@/contexts/SessionContext";

export const SessionLayout = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<number | null>(null);

  return (
    <SessionProvider value={{ gameId, setGameId, capacity, setCapacity }}>
      <Outlet />
    </SessionProvider>
  );
};
