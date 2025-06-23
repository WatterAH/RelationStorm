import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Providers from "./Providers.tsx";
import {BrowserRouter, Routes, Route} from "react-router";
import Index from "./Index.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
      <Routes>
        <Route path="/schema" element={<App />}/>
        <Route path="/" element={<Index/>}/>
      </Routes>
      </BrowserRouter>
    
    </Providers>
  </StrictMode>
);
