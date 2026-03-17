export type RollingAverageMonth = {
  yearMonth: string;
  value: number;
};

export type RollingAverage = {
  average: number;
  months: RollingAverageMonth[];
};

export type RollingPerfomanceMonth = {
  yearMonth: string;
  value: number;
};

export type RollingPerfomance = {
  months: RollingPerfomanceMonth[];
};

export type FiveYearTrendYear = {
  year: string;
  value: number;
  yoyPercentage: number | null;
};

export type FiveYearTrend = {
  years: FiveYearTrendYear[];
};

export type AllTimeTotalYear = {
  year: string;
  value: number;
};

export type AllTimeTotal = {
  years: AllTimeTotalYear[];
};

export type Type =
  | "ALL_TIME_TOTAL"
  | "ROLLING_AVERAGE"
  | "FIVE_YEAR_TREND"
  | "ROLLING_PERFORMANCE";
