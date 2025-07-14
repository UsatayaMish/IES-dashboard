import { useEffect, useState, useCallback } from "react";
import signalRService from "../services/SignalRService";
import type { UES } from "../types/UES";
import { fetchAllUESData } from "../services/apiService"; // Убедитесь, что импортирован fetchAllUESData

// Убедитесь, что эти URL правильные для вашего бэкенда
const HUB_URL = "http://localhost:5154/energyHub"; // Проверьте этот адрес
const GET_DATA_URL = "http://localhost:5154/api/ues/all-regions"; // ИСПРАВЛЕННЫЙ URL для GET запроса

interface UseUESDataOptions {
  isSimulationMode: boolean; // Оставим isSimulationMode
}

// Теперь хук возвращает массив: [данные, функция для обновления данных]
export default function useUESData({
  isSimulationMode,
}: UseUESDataOptions): [UES[], () => void] {
  // Изменили возвращаемый тип
  const [uesData, setUesData] = useState<UES[]>([]);
  const [refetchCounter, setRefetchCounter] = useState(0); // Состояние-триггер для ручного обновления

  // Функция для запуска повторного получения данных
  const refetchData = useCallback(() => {
    setRefetchCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllUESData(GET_DATA_URL);
        setUesData(data);
      } catch (error) {
        console.error("Ошибка при получении данных с бэкенда:", error);
      }
    };

    if (isSimulationMode) {
      // Логика SignalR
      const connectAndSubscribe = async () => {
        try {
          await signalRService.connect(HUB_URL);
          const unsubscribe = signalRService.subscribeToUESData((data) => {
            setUesData(data);
          });

          return () => {
            unsubscribe();
            signalRService.disconnect();
          };
        } catch (error) {
          console.error(
            "Ошибка при подключении к SignalR или подписке:",
            error
          );
        }
      };

      const cleanup = connectAndSubscribe();
      return () => {
        cleanup.then((fn) => fn && fn());
      };
    } else {
      // Логика REST API (привязана к refetchCounter)
      fetchData();
    }
  }, [isSimulationMode, refetchCounter]); // Добавляем refetchCounter в зависимости

  return [uesData, refetchData];
}
