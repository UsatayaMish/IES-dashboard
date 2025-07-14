import React from "react";
import { SimulationModeContext } from "../context/SimulationModeContext";

export const useSimulationMode = () => {
  const context = React.useContext(SimulationModeContext);
  // Проверяем на `null` вместо `undefined`
  if (context === null) {
    throw new Error(
      "useSimulationMode must be used within a SimulationModeProvider"
    );
  }
  return context;
};
