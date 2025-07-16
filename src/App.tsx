import { useState, useEffect, useCallback } from "react";
import "./App.css";
import type { UES } from "./types/UES";
import InteractiveBlock from "./components/InteractiveBlock";
import ObjectModal from "./components/modal/ObjectModal";
import useUESData from "./hooks/useUESData";
import Header from "./components/header/Header";
import { useSimulationMode } from "./hooks/useSimulationMode";
import NotificationPopup from "./components/NotificationPopup";
import signalRService from "./services/SignalRService";

interface NotificationItem {
  id: string;
  message: string;
  isVisible: boolean;
  timerId: NodeJS.Timeout | null;
}

function App() {
  const { isSimulationMode } = useSimulationMode();

  const [uesData, refetchUESData] = useUESData({ isSimulationMode });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUES, setSelectedUES] = useState<UES | null>(null);

  const [activeNotifications, setActiveNotifications] = useState<
    NotificationItem[]
  >([]);

  const removeNotification = useCallback((id: string) => {
    setActiveNotifications((prev) => {
      const notificationToRemove = prev.find((n) => n.id === id);
      if (notificationToRemove && notificationToRemove.timerId) {
        clearTimeout(notificationToRemove.timerId);
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  const handleBlockClick = (id: number | string) => {
    const data = uesData.find((item) => item.id === id);
    if (data) {
      setSelectedUES(data);
      setIsModalOpen(true);
    } else {
      console.warn(`Объект с ID ${id} не найден в данных.`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUES(null);
  };

  useEffect(() => {
    const unsubscribe = signalRService.subscribeToNotifications(
      (message: string) => {
        const newNotificationId =
          Date.now().toString() + Math.random().toString().substring(2, 8); // Уникальный ID

        const newNotification: NotificationItem = {
          id: newNotificationId,
          message: message,
          isVisible: true,
          timerId: null,
        };

        setActiveNotifications((prev) => [...prev, newNotification]);

        const timer = setTimeout(() => {
          setActiveNotifications((currentNotifications) => {
            const updated = currentNotifications.map((n) =>
              n.id === newNotificationId ? { ...n, isVisible: false } : n
            );

            setTimeout(() => {
              removeNotification(newNotificationId);
            }, 300);
            return updated;
          });
        }, 10000);

        newNotification.timerId = timer;
      }
    );

    return () => {
      unsubscribe();
      setActiveNotifications((prev) => {
        prev.forEach((n) => {
          if (n.timerId) clearTimeout(n.timerId);
        });
        return [];
      });
    };
  }, [removeNotification]);

  useEffect(() => {
    if (isModalOpen && selectedUES) {
      const updatedSelectedUES = uesData.find(
        (item) => item.id === selectedUES.id
      );
      if (updatedSelectedUES && updatedSelectedUES !== selectedUES) {
        setSelectedUES(updatedSelectedUES);
      }
    }
  }, [uesData, isModalOpen, selectedUES]);

  if (uesData.length === 0) {
    return <div className="loading-screen">Загрузка данных...</div>;
  }

  return (
    <>
      <Header onDataReset={refetchUESData} />
      <main className="main-content-wrapper">
        <div className="grid-container">
          <InteractiveBlock
            data={uesData.find((item) => item.id === 1)!}
            className="item-1"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 2)!}
            className="item-2"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 3)!}
            className="item-3"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 4)!}
            className="item-4"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 5)!}
            className="item-5"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 6)!}
            className="item-6"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 7)!}
            className="item-7"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 8)!}
            className="item-aek-tites"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 9)!}
            className="item-aek-prom"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 10)!}
            className="item-aek-viz"
            onClick={handleBlockClick}
          />
        </div>
      </main>
      <ObjectModal
        isOpen={isModalOpen}
        data={selectedUES}
        onClose={handleCloseModal}
        onDataUpdated={refetchUESData}
      ></ObjectModal>

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column-reverse",
          gap: "10px",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        {activeNotifications.map((notification) => (
          <NotificationPopup
            key={notification.id}
            message={notification.message}
            isVisible={notification.isVisible}
            onClose={() => {
              setActiveNotifications((prev) => {
                const updated = prev.map((n) =>
                  n.id === notification.id ? { ...n, isVisible: false } : n
                );

                const closedNotification = updated.find(
                  (n) => n.id === notification.id
                );
                if (closedNotification && closedNotification.timerId) {
                  clearTimeout(closedNotification.timerId);
                }

                setTimeout(() => {
                  removeNotification(notification.id);
                }, 300);
                return updated;
              });
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
