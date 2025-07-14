import React, { useState, useEffect } from "react";
import signalRService from "../../services/SignalRService";
import axios from "axios";
import { useSimulationMode } from "../../hooks/useSimulationMode";

const API_BASE_URL = "http://localhost:5154";
const SIMULATE_URL = `${API_BASE_URL}/api/energy/simulate`;
const PAUSE_URL = `${API_BASE_URL}/api/energy/pause`;
const RESUME_URL = `${API_BASE_URL}/api/energy/resume`;
const RESET_URL = `${API_BASE_URL}/api/ues/reset`;
const STOP_URL = `${API_BASE_URL}/api/energy/stop`;

const SPEED_FACTOR_OPTIONS = [1800, 3600, 5400, 7200, 10800];

interface HeaderProps {
  onDataReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDataReset }) => {
  const { isSimulationMode, toggleSimulationMode } = useSimulationMode();

  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00:00");
  const [speedFactor, setSpeedFactor] = useState<number>(
    SPEED_FACTOR_OPTIONS[0]
  );

  useEffect(() => {
    const unsubscribeStatus = signalRService.subscribeToSimulationStatus(
      (data) => {
        console.log("Header: Получен статус симуляции:", data);
        if (data.status === "Started" || data.status === "Resumed") {
          setIsSimulationRunning(true);
          setIsSimulationPaused(false);
        } else if (data.status === "Paused") {
          setIsSimulationRunning(true);
          setIsSimulationPaused(true);
        } else if (data.status === "Stopped" || data.status === "Completed") {
          setIsSimulationRunning(false);
          setIsSimulationPaused(false);
          setCurrentTime("00:00:00");
        }
      }
    );

    const unsubscribeTime = signalRService.subscribeToCurrentTime((data) => {
      setCurrentTime(data.time ?? "00:00:00");
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTime();
    };
  }, []);

  const handleStartSimulation = async () => {
    try {
      // При старте всегда начинаем с не-паузы
      await axios.post(`${SIMULATE_URL}/${speedFactor}`);
      console.log("Симуляция запущена/возобновлена с фактором:", speedFactor);
    } catch (error) {
      console.error("Ошибка при запуске симуляции:", error);
      alert("Не удалось запустить симуляцию.");
    }
  };

  const handleTogglePauseResume = async () => {
    if (isSimulationPaused) {
      try {
        await axios.post(RESUME_URL);
        console.log("Симуляция возобновлена.");
      } catch (error) {
        console.error("Ошибка при возобновлении симуляции:", error);
        alert("Не удалось возобновить.");
      }
    } else {
      try {
        await axios.post(PAUSE_URL);
        console.log("Симуляция поставлена на паузу.");
      } catch (error) {
        console.error("Ошибка при паузе симуляции:", error);
        alert("Не удалось поставить на паузу.");
      }
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(RESET_URL);
      console.log("Данные успешно сброшены.");
      onDataReset();
    } catch (error) {
      console.error("Ошибка при сбросе данных:", error);
      alert("Не удалось сбросить данные.");
    }
  };

  const handleStopSimulation = async () => {
    try {
      await axios.post(STOP_URL);
      console.log("Симуляция остановлена.");
    } catch (error) {
      console.error("Ошибка при остановке симуляции:", error);
      alert("Не удалось остановить.");
    }
  };

  return (
    <header
      style={{
        padding: "10px",
        backgroundColor: "#333",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ marginLeft: "60px" }}>ИЭС</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Кнопка переключения общего режима симуляции */}
        <button
          onClick={toggleSimulationMode}
          // ИСПРАВЛЕНО: Отключаем кнопку, если симуляция запущена
          disabled={isSimulationRunning}
          style={{
            backgroundColor: isSimulationMode ? "orange" : "green",
            color: "white",
            padding: "8px 15px",
            cursor: isSimulationRunning ? "not-allowed" : "pointer",
            borderRadius: "5px",
            border: "none",
            opacity: isSimulationRunning ? 0.6 : 1, // Визуальное отключение
          }}
        >
          {isSimulationMode
            ? "Выключить режим симуляции (редактирование)"
            : "Включить режим симуляции (просмотр)"}
        </button>

        {!isSimulationMode && <button onClick={handleReset}>Reset</button>}

        {isSimulationMode && ( // Показываем элементы управления симуляцией только если общий режим симуляции активен
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Время: {currentTime}</span>
            <label htmlFor="speedFactorSelect">Шаг:</label>
            <select
              id="speedFactorSelect"
              value={speedFactor}
              onChange={(e) => setSpeedFactor(Number(e.target.value))}
              style={{ padding: "5px" }}
              // Отключаем изменение шага, если симуляция запущена
              disabled={isSimulationRunning}
            >
              {SPEED_FACTOR_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  x{option}
                </option>
              ))}
            </select>

            <button
              onClick={handleStartSimulation}
              // Кнопка Start активна, только если симуляция не запущена
              disabled={isSimulationRunning}
              style={{ backgroundColor: "#28a745", color: "white" }}
            >
              Start
            </button>
            {/* ИСПРАВЛЕНО: Единая кнопка Pause/Resume */}
            <button
              onClick={handleTogglePauseResume}
              // Активна, если симуляция запущена
              disabled={!isSimulationRunning}
              style={{
                backgroundColor: isSimulationPaused ? "#17a2b8" : "#ffc107",
                color: isSimulationPaused ? "white" : "black",
              }}
            >
              {isSimulationPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={handleStopSimulation}
              disabled={!isSimulationRunning}
              style={{ backgroundColor: "#dc3545", color: "white" }}
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
