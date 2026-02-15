import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppRecorder from "./recorder/app-recorder";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppRecorder />
    </BrowserRouter>
  </StrictMode>,
);
