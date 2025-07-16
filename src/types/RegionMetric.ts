export interface RegionMetric {
  name: string;
  id: number;
  status: boolean;
  producedEnergy: number;
  consumedEnergy: number;
  firstCategoryDeficit: number;
  remainingDeficit: number;
  npP_Percentage: number;
  hpP_Percentage: number;
  cgpP_Percentage: number;
  wpP_Percentage: number;
  spP_Percentage: number;
  firstPercentage: number;
  secondPercentage: number;
  thirdPercentage: number;

  timeZoneOffset: number;
}
