import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import { GameSessionLayout } from "@/layouts/GameSessionLayout";
import Game from "@/pages/Game";
import LobbyPage from "@/pages/LobbyPage";
import LoginPage from "@/pages/LoginPage";
import WaitingRoom from "@/pages/WaitingRoom";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<AuthenticatedLayout />}>
              <Route index element={<LobbyPage />} />
              <Route path=":gameId" element={<GameSessionLayout />}>
                <Route path="waiting" element={<WaitingRoom />} />
                {/* Nested route for the game page */}
                <Route path="game" element={<Game />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SocketProvider>
  </StrictMode>,
);
