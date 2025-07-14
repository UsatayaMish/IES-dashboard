import type { RegionMetric } from "../types/RegionMetric";
import type { UES } from "../types/UES";

export const regionMetricToUES = (regionMetric: RegionMetric): UES => {
  return {
    id: regionMetric.id,
    name: regionMetric.name,
    producedCapacity: regionMetric.producedEnergy,
    consumedCapacity: regionMetric.consumedEnergy,
    status: regionMetric.status,
    timeZoneOffset: regionMetric.timeZoneOffset,

    powerSourceId: regionMetric.id,
    powerSource: {
      id: regionMetric.id,
      npP_Percentage: regionMetric.npP_Percentage,
      hpP_Percentage: regionMetric.hpP_Percentage,
      cgpP_Percentage: regionMetric.cgpP_Percentage,
      wpP_Percentage: regionMetric.wpP_Percentage,
      spP_Percentage: regionMetric.spP_Percentage,
      totalPercentage:
        regionMetric.npP_Percentage +
        regionMetric.hpP_Percentage +
        regionMetric.cgpP_Percentage +
        regionMetric.wpP_Percentage +
        regionMetric.spP_Percentage,
    },
    consumerId: regionMetric.id,
    consumer: {
      id: regionMetric.id,
      firstPercentage: regionMetric.firstPercentage ?? 0,
      secondPercentage: regionMetric.secondPercentage ?? 0,
      thirdPercentage: regionMetric.thirdPercentage ?? 0,
    },

    firstCategoryDeficit: regionMetric.firstCategoryDeficit,
    remainingDeficit: regionMetric.remainingDeficit,
  };
};

export const regionMetricsToUES = (regionMetrics: RegionMetric[]): UES[] => {
  return regionMetrics.map(regionMetricToUES);
};
