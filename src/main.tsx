import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { AuthProvider } from "@/components/Common/AuthProvider";
import "@/index.css";
import AppRouter from "@/pages/AppRouter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
);
