import { isNil } from "lodash-es";
import type { Payroll } from "..";
import type {
  AllTimeTotal,
  FiveYearTrend,
  RollingAverage,
  RollingPerfomance,
} from "./types";

export const toRollingAverage = (
  data: Payroll.StatsResponse,
): RollingAverage => {
  if (data.interval !== "MONTHLY") throw new Error("Unexpected interval");

  return {
    average: data.average,
    months: data.years.flatMap((year) =>
      year.months.map((month) => ({
        yearMonth: month.yearMonth,
        value: month.value,
      })),
    ),
  };
};

export const toRollingPerformance = (
  data: Payroll.StatsResponse,
): RollingPerfomance => {
  if (data.interval !== "MONTHLY") throw new Error("Unexpected interval");

  return {
    months: data.years
      .flatMap((year) =>
        year.months.map((month) => ({
          yearMonth: month.yearMonth,
          value: month.yoyPercentage,
        })),
      )
      .toSorted((a, b) => b.yearMonth.localeCompare(a.yearMonth)),
  };
};

export const toAllTimeTotal = (data: Payroll.StatsResponse): AllTimeTotal => {
  if (data.interval !== "YEARLY") throw new Error("Unexpected interval");

  return {
    years: data.years.map((item) => ({
      year: item.year,
      value: item.cumulativeSum,
      yoyPercentage: item.yoyPercentage,
    })),
  };
};

export const toFiveYearTrend = (data: Payroll.StatsResponse): FiveYearTrend => {
  if (data.interval !== "YEARLY") throw new Error("Unexpected interval");

  return {
    years: data.years
      .map((item) => ({
        year: item.year,
        value: item.sum,
        yoyPercentage: item.yoyPercentage,
      }))
      .toSorted((a, b) => b.year.localeCompare(a.year)),
  };
};

export const hasSufficientRollingAverageData = (
  data: Payroll.StatsResponse,
): boolean => {
  if (data.interval !== "MONTHLY") throw new Error("Unexpected interval");

  return data.years.some((year) =>
    year.months.some((month) => month.value > 0),
  );
};

export const hasSufficientRollingPerformanceData = (
  data: Payroll.StatsResponse,
): boolean => {
  if (data.interval !== "MONTHLY") throw new Error("Unexpected interval");

  return data.years.some((year) =>
    year.months.some((month) => !isNil(month.yoyPercentage)),
  );
};

export const hasSufficientAllTimeTotalData = (
  data: Payroll.StatsResponse,
): boolean => {
  if (data.interval !== "YEARLY") throw new Error("Unexpected interval");

  return data.years.filter((year) => year.cumulativeSum > 0).length >= 2;
};

export const hasSufficientFiveYearTrendData = (
  data: Payroll.StatsResponse,
): boolean => {
  if (data.interval !== "YEARLY") throw new Error("Unexpected interval");

  return data.years.some((year) => year.sum > 0);
};
