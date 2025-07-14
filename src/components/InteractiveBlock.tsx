import type { UES } from "../types/UES";
import React from "react";

interface InteractiveBlockProps {
  data: UES;
  className: string;
  onClick: (id: number) => void;
}

const InteractiveBlock: React.FC<InteractiveBlockProps> = ({
  data,
  className,
  onClick,
}) => {
  const getStatusColor = (status: UES["status"]) => {
    switch (status) {
      case true:
        return "green";
      case false:
        return "red";
    }
  };

  const blockStyle = {
    backgroundColor: getStatusColor(data.status),
    cursor: "pointer",
  };

  return (
    <div
      className={`grid-item ${className}`}
      style={blockStyle}
      onClick={() => onClick(data.id)}
    >
      <h3>{data.name}</h3>
    </div>
  );
};

export default InteractiveBlock;
