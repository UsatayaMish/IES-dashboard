import { useEffect, useState, useCallback } from "react";
import signalRService from "../services/SignalRService";
import type { UES } from "../types/UES";
import { fetchAllUESData } from "../services/apiService";

const GET_DATA_URL = "http://localhost:5154/api/ues/all-regions";

interface UseUESDataOptions {
  isSimulationMode: boolean;
}

export default function useUESData({
  isSimulationMode,
}: UseUESDataOptions): [UES[], () => void] {
  const [uesData, setUesData] = useState<UES[]>([]);
  const [refetchCounter, setRefetchCounter] = useState(0);

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

    let unsubscribeUESData: (() => void) | undefined;

    if (isSimulationMode) {
      unsubscribeUESData = signalRService.subscribeToUESData((data) => {
        setUesData(data);
      });
    } else {
      fetchData();
    }

    return () => {
      if (unsubscribeUESData) {
        unsubscribeUESData();
      }
    };
  }, [isSimulationMode, refetchCounter]);

  return [uesData, refetchData];
}
