import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { AuthProvider } from "@/components/Common/AuthProvider";
import "@/index.css";
import { AuthLayout } from "@/layouts/AuthLayout";
import { GameSessionLayout } from "@/layouts/GameSessionLayout";
import { SessionLayout } from "@/layouts/SessionLayout";
import Game from "@/pages/Game";
import LobbyPage from "@/pages/LobbyPage";
import LoginPage from "@/pages/LoginPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AuthLayout />}>
            <Route element={<SessionLayout />}>
              <Route path="/" element={<LobbyPage />} />
              <Route element={<GameSessionLayout />}>
                {/* Nested route for the game page */}
                <Route path="game" element={<Game />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
