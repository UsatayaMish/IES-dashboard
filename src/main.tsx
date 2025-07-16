import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SimulationModeProvider } from "./context/SimulationModeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <SimulationModeProvider>
    <App />
  </SimulationModeProvider>
);
