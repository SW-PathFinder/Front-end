import { useState } from "react";

import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/contexts/AuthContext";
import { AuthenticatedProvider } from "@/contexts/SessionContext";

export const AuthenticatedLayout = () => {
  const { userId } = useAuth();
  const [capacity, setCapacity] = useState<number | null>(null);
  const location = useLocation();

  if (!userId) {
    return (
      <Navigate
        to={{ pathname: "/login" }}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return (
    <AuthenticatedProvider value={{ userId, capacity, setCapacity }}>
      <Outlet />
    </AuthenticatedProvider>
  );
};
