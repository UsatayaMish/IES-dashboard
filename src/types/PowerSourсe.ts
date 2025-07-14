export interface PowerSource {
  id: number;
  npP_Percentage: number;
  hpP_Percentage: number;
  cgpP_Percentage: number;
  wpP_Percentage: number;
  spP_Percentage: number;

  npP_capacity?: number;
  hpP_capacity?: number;
  cgpP_capacity?: number;
  wpP_capacity?: number;
  spP_capacity?: number;

  totalPercentage?: number;
}
