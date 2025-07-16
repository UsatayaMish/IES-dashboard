import axios from "axios";
import type { UES } from "../types/UES";
import type { PowerSource } from "../types/PowerSourсe";

export type PowerSourcePatchPayload = Partial<PowerSource> & {
  id: number;
  npP_capacity?: number;
  hpP_capacity?: number;
  cgpP_capacity?: number;
  wpP_capacity?: number;
  spP_capacity?: number;
};

export type UESUpdatePayload = Partial<Omit<UES, "powerSource">> & {
  powerSource?: PowerSourcePatchPayload;
};
export async function fetchAllUESData(url: string): Promise<UES[]> {
  const response = await axios.get<UES[]>(url);
  return response.data;
}

export async function updateUESData(
  url: string,
  id: number,
  updatedFields: UESUpdatePayload
): Promise<UES> {
  const response = await axios.patch<UES>(`${url}/${id}`, updatedFields);
  return response.data;
}
