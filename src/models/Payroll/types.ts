import type z from "zod";
import type {
  Nullable,
  StrictExtract,
  Year,
  YearMonth,
} from "../../shared/types/common";
import type { ENTRY_TYPE, FORM_SCHEMA } from "./constants";

export type StatsMetric =
  | "GROSS_INCOME"
  | "GROSS_BASE_SALARY"
  | "GROSS_BONUS_SALARY"
  | "NET_INCOME"
  | "NET_BASE_SALARY"
  | "NET_BONUS_SALARY"
  | "DEDUCTIONS"
  | "TAXES"
  | "INSURANCE_DEDUCTIONS"
  | "INCOME_TAX"
  | "CHURCH_TAX"
  | "SOLIDARITY_SURCHARGE"
  | "HEALTH_INSURANCE"
  | "PENSION_INSURANCE"
  | "UNEMPLOYMENT_INSURANCE"
  | "LONG_TERM_CARE_INSURANCE";

export type StatsInterval = "MONTHLY" | "YEARLY";

export type StatsRequest = {
  metric: StatsMetric;
} & (
  | {
      interval: StrictExtract<StatsInterval, "MONTHLY">;
      startYearMonth?: YearMonth;
      endYearMonth?: YearMonth;
      startYear?: never;
      endYear?: never;
    }
  | {
      interval: StrictExtract<StatsInterval, "YEARLY">;
      startYearMonth?: never;
      endYearMonth?: never;
      startYear?: Year;
      endYear?: Year;
    }
);

type StatsResponseMonth = {
  yearMonth: YearMonth;
  value: number;
  yoyPercentage: number;
  momPercentage: number;
};

type YearlyStatsResponseYear = {
  year: Year;
  sum: number;
  cumulativeSum: number;
  average: number;
  yoyPercentage: number;
};

type MonthlyStatsResponseYear = YearlyStatsResponseYear & {
  months: StatsResponseMonth[];
};

export type StatsResponse = {
  metric: StatsMetric;
  sum: number;
  average: number;
} & (
  | {
      interval: StrictExtract<StatsInterval, "YEARLY">;
      years: YearlyStatsResponseYear[];
    }
  | {
      interval: StrictExtract<StatsInterval, "MONTHLY">;
      years: MonthlyStatsResponseYear[];
    }
);

export type BaseMutationErrorCode = "DUPLICATE_ACCOUNTING_PERIOD";

export type UploadResponseErrorCode =
  | BaseMutationErrorCode
  | "UNSUPPORTED_PROVIDER"
  | "PAYROLL_PARSING_FAILED";

export type EntryType = keyof typeof ENTRY_TYPE;

export type Entry = {
  type: EntryType;
  amount: number;
};

export type UploadRequest = {
  file: File;
  fileId: string;
};

export type BaseMutationRequest = {
  payout: number;
  entries: Entry[];
};

export type CreateRequest = BaseMutationRequest & {
  accountingPeriod: string;
};

export type UpdateRequest = BaseMutationRequest & {
  payrollId: string;
};

export type DeleteRequest = {
  payrollId: string;
};

export type QueryResponse = {
  payrollId: string;
  accountingPeriod: YearMonth;
  consistencyDeviation: number;
  payout: number;
  entries: Entry[];
};

export type MultipleQueryRequest = {
  consistent?: boolean;
  limit?: number;
  cursor?: Year;
};

export type MultipleQueryResponse = {
  hasMore: boolean;
  nextCursor: Nullable<Year>;
  years: {
    year: Year;
    count: number;
    sum: number;
    entries: {
      payrollId: string;
      accountingPeriod: YearMonth;
      consistencyDeviation: number;
      payout: number;
    }[];
  }[];
};

export type FormValues = z.infer<ReturnType<typeof FORM_SCHEMA>>;
