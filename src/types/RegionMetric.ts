export interface RegionMetric {
  name: string;
  id: number; // Соответствует UES.id
  status: boolean;
  producedEnergy: number; // Соответствует UES.producedCapacity
  consumedEnergy: number; // Соответствует UES.consumedCapacity
  firstCategoryDeficit: number;
  remainingDeficit: number;
  // Источники энергии
  npP_Percentage: number; // АЭС
  hpP_Percentage: number; // ГЭС
  cgpP_Percentage: number; // ТЭС
  wpP_Percentage: number; // ВЭС
  spP_Percentage: number; // СЭС
  // Потребители
  firstPercentage: number; // Первая категория
  secondPercentage: number; // Вторая категория
  thirdPercentage: number; // Третья категория

  timeZoneOffset: number;
}
