import type { Chart, Payroll } from "../../models";
import type { StrictExtract, Year, YearMonth } from "./common";

export type StatCategory = "INCOME" | "DEDUCTIONS" | "BONUS";

export type StatChart = {
  title: string;
  category: StatCategory;
  chartType: Chart.Type;
  metric: Payroll.StatsMetric;
} & (
  | {
      interval: StrictExtract<Payroll.StatsInterval, "MONTHLY">;
      startYearMonth?: YearMonth;
      endYearMonth?: YearMonth;
      startYear?: never;
      endYear?: never;
    }
  | {
      interval: StrictExtract<Payroll.StatsInterval, "YEARLY">;
      startYearMonth?: never;
      endYearMonth?: never;
      startYear?: Year;
      endYear?: Year;
    }
);
