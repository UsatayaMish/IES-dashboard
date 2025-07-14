import { createContext } from "react";

interface SimulationModeContextType {
  isSimulationMode: boolean;
  toggleSimulationMode: () => void;
}

export const SimulationModeContext =
  createContext<SimulationModeContextType | null>(null);
