import type { Consumer } from "./Consumer";
import type { PowerSource } from "./PowerSourсe";

export interface UES {
  id: number;
  name: string;
  producedCapacity: number;
  consumedCapacity: number;
  powerSourceId: number;
  powerSource: PowerSource;
  consumerId: number;
  consumer: Consumer;
  timeZoneOffset: number | null;
  status: boolean | null;

  firstCategoryDeficit?: number;
  remainingDeficit?: number;
}
