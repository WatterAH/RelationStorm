import "./index.css";
import App from "./App.tsx";
import Index from "./Index.tsx";
import Providers from "./Providers.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/schema/:id" element={<App />} />
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  </StrictMode>
);
