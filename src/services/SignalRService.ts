import * as signalR from "@microsoft/signalr";
import type { UES } from "../types/UES";
import type { RegionMetric } from "../types/RegionMetric";
import { regionMetricsToUES } from "../utils/dataTransformers";

type UESDataCallback = (data: UES[]) => void;
type SimulationStatusCallback = (data: {
  status: string;
  message: string;
}) => void;
type CurrentTimeCallback = (data: { time: string }) => void;
type DistributionUpdateCallback = (data: {
  recipientId: number;
  donorId: number;
  amount: number;
  category: "First" | "Remaining";
}) => void;
type ConnectionUpdateCallback = (
  data: Array<{
    sourceRegionId: number;
    destinationRegionId: number;
    sentFirstCategoryCapacity: number;
    receivedFirstCategoryCapacity: number;
    sentRemainingCapacity: number;
    receivedRemainingCapacity: number;
  }>
) => void;
type NotificationCallback = (message: string) => void;

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private uesDataListeners: UESDataCallback[] = [];
  private simulationStatusListeners: SimulationStatusCallback[] = [];
  private currentTimeListeners: CurrentTimeCallback[] = [];
  private distributionUpdateListeners: DistributionUpdateCallback[] = [];
  private connectionUpdateListeners: ConnectionUpdateCallback[] = [];
  private notificationListeners: NotificationCallback[] = [];

  constructor() {}

  public async connect(hubUrl: string): Promise<void> {
    if (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    ) {
      console.log("SignalR: Уже подключены.");
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 1000;
          }
          return null;
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on("ReceiveRegionMetrics", (data: RegionMetric[]) => {
      console.log("SignalR: Получены сырые данные RegionMetrics:", data);
      const transformedData = regionMetricsToUES(data);
      console.log("SignalR: Трансформированные данные UES:", transformedData);
      this.uesDataListeners.forEach((callback) => callback(transformedData));
    });

    this.connection.on(
      "ReceiveSimulationStatus",
      (data: { status: string; message: string }) => {
        console.log("ReceiveSimulationStatus:", data);
        this.simulationStatusListeners.forEach((callback) => callback(data));
      }
    );

    this.connection.on("ReceiveCurrentTime", (data: { time: string }) => {
      console.log("ReceiveCurrentTime:", data);
      this.currentTimeListeners.forEach((callback) => callback(data));
    });

    this.connection.on(
      "ReceiveDistributionUpdate",
      (data: {
        recipientId: number;
        donorId: number;
        amount: number;
        category: "First" | "Remaining";
      }) => {
        console.log("ReceiveDistributionUpdate:", data);
        this.distributionUpdateListeners.forEach((callback) => callback(data));
      }
    );

    this.connection.on(
      "ReceiveConnectionUpdate",
      (
        connections: Array<{
          sourceRegionId: number;
          destinationRegionId: number;
          sentFirstCategoryCapacity: number;
          receivedFirstCategoryCapacity: number;
          sentRemainingCapacity: number;
          receivedRemainingCapacity: number;
        }>
      ) => {
        console.log("ReceiveConnectionUpdate:", connections);
        this.connectionUpdateListeners.forEach((callback) =>
          callback(connections)
        );
      }
    );

    this.connection.on("SimulationFinished", () => {
      console.log("SignalR: Симуляция завершена.");
      this.simulationStatusListeners.forEach((callback) =>
        callback({ status: "Completed", message: "Симуляция завершена" })
      );
    });

    this.connection.on("EspUpdated", (message: string) => {
      console.log(
        "SignalR: Получено текстовое уведомление (EspUpdated):",
        message
      );
      this.notificationListeners.forEach((callback) => callback(message));
    });

    this.connection.onclose(async (error?: Error) => {
      console.error("SignalR: Соединение закрыто:", error);
    });

    try {
      await this.connection.start();
      console.log("SignalR: Подключено к хабу.");
    } catch (err) {
      console.error("SignalR: Ошибка подключения:", err);
    }
  }

  public async disconnect(): Promise<void> {
    if (
      this.connection &&
      this.connection.state !== signalR.HubConnectionState.Disconnected
    ) {
      try {
        await this.connection.stop();
        console.log("SignalR: Соединение отключено.");
      } catch (err) {
        console.error("SignalR: Ошибка при отключении:", err);
      }
    }
    this.connection = null;
  }

  public subscribeToUESData(callback: UESDataCallback): () => void {
    this.uesDataListeners.push(callback);
    return () => {
      this.uesDataListeners = this.uesDataListeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  public subscribeToSimulationStatus(
    callback: SimulationStatusCallback
  ): () => void {
    this.simulationStatusListeners.push(callback);
    return () => {
      this.simulationStatusListeners = this.simulationStatusListeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  public subscribeToCurrentTime(callback: CurrentTimeCallback): () => void {
    this.currentTimeListeners.push(callback);
    return () => {
      this.currentTimeListeners = this.currentTimeListeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  public subscribeToDistributionUpdates(
    callback: DistributionUpdateCallback
  ): () => void {
    this.distributionUpdateListeners.push(callback);
    return () => {
      this.distributionUpdateListeners =
        this.distributionUpdateListeners.filter(
          (listener) => listener !== callback
        );
    };
  }

  public subscribeToConnectionUpdates(
    callback: ConnectionUpdateCallback
  ): () => void {
    this.connectionUpdateListeners.push(callback);
    return () => {
      this.connectionUpdateListeners = this.connectionUpdateListeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  public subscribeToNotifications(callback: NotificationCallback): () => void {
    this.notificationListeners.push(callback);
    return () => {
      this.notificationListeners = this.notificationListeners.filter(
        (listener) => listener !== callback
      );
    };
  }
}

const signalRService = new SignalRService();
signalRService.connect("http://localhost:5154/energyHub");

export default signalRService;
