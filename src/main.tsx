import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "@/index.css";
import { GameSessionLayout } from "@/layouts/GameSessionLayout";
import { SessionLayout } from "@/layouts/SessionLayout";
import Game from "@/pages/Game";
import Home from "@/pages/Home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<SessionLayout />}>
          <Route path="/" element={<Home />} />
          <Route element={<GameSessionLayout />}>
            {/* Nested route for the game page */}
            <Route path="/game" element={<Game />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
