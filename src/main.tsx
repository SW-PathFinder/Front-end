import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import { GameRoomLayout } from "@/layouts/GameRoomLayout";
import { GameSessionLayout } from "@/layouts/GameSessionLayout";
import { OpenViduProvider } from "@/libs/openvidu";
import Game from "@/pages/Game";
import LobbyPage from "@/pages/LobbyPage";
import LoginPage from "@/pages/LoginPage";
import WaitingRoom from "@/pages/WaitingRoom";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <AuthProvider>
        <OpenViduProvider>
          <BrowserRouter>
            <Routes>
              <Route path="login" element={<LoginPage />} />
              <Route element={<AuthenticatedLayout />}>
                <Route index element={<Navigate to="/saboteur" />} />
                <Route path="saboteur">
                  <Route index element={<LobbyPage />} />
                  <Route path=":roomId" element={<GameRoomLayout />}>
                    <Route path="waiting" element={<WaitingRoom />} />
                    <Route element={<GameSessionLayout />}>
                      <Route path="game" element={<Game />} />
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </OpenViduProvider>
      </AuthProvider>
    </SocketProvider>
  </StrictMode>,
);
