import React from "react";

interface NotificationPopupProps {
  message: string;
  onClose: () => void;
  isVisible: boolean;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  message,
  onClose,
  isVisible,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#333",
        color: "white",
        padding: "15px 25px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
        maxWidth: "300px",
        wordWrap: "break-word",
        fontFamily: "Arial, sans-serif",
        fontSize: "0.95em",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <p style={{ margin: 0, padding: 0 }}>{message}</p>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "none",
          border: "none",
          color: "white",
          fontSize: "1.2em",
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default NotificationPopup;
