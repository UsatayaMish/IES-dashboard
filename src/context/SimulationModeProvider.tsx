import React, { type ReactNode, useState } from "react";
import { SimulationModeContext } from "./SimulationModeContext";

interface SimulationModeProviderProps {
  children: ReactNode;
}

export const SimulationModeProvider: React.FC<SimulationModeProviderProps> = ({
  children,
}) => {
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);

  const toggleSimulationMode = () => {
    setIsSimulationMode((prevMode) => !prevMode);
  };

  const value = { isSimulationMode, toggleSimulationMode };

  return (
    <SimulationModeContext.Provider value={value}>
      {children}
    </SimulationModeContext.Provider>
  );
};
