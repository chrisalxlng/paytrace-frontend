import z from "zod";
import { payrollQueries } from "../../api/payroll.queries";
import { queryClient } from "../../main";
import { m } from "../../paraglide/messages";
import type { YearMonth } from "../../shared/types/common";
import { getCurrentYearMonth } from "../../shared/utils/common";
import {
  currencyFormatter,
  yearMonthFormatter,
} from "../../shared/utils/formatters";

export const ENTRY_TYPE = {
  BASE_SALARY: "BASE_SALARY",
  BASE_INCOME_TAX: "BASE_INCOME_TAX",
  BASE_CHURCH_TAX: "BASE_CHURCH_TAX",
  BASE_SOLIDARITY_SURCHARGE: "BASE_SOLIDARITY_SURCHARGE",
  BASE_HEALTH_INSURANCE: "BASE_HEALTH_INSURANCE",
  BASE_PENSION_INSURANCE: "BASE_PENSION_INSURANCE",
  BASE_UNEMPLOYMENT_INSURANCE: "BASE_UNEMPLOYMENT_INSURANCE",
  BASE_LONG_TERM_CARE_INSURANCE: "BASE_LONG_TERM_CARE_INSURANCE",

  BONUS_SALARY: "BONUS_SALARY",
  BONUS_INCOME_TAX: "BONUS_INCOME_TAX",
  BONUS_CHURCH_TAX: "BONUS_CHURCH_TAX",
  BONUS_SOLIDARITY_SURCHARGE: "BONUS_SOLIDARITY_SURCHARGE",
  BONUS_HEALTH_INSURANCE: "BONUS_HEALTH_INSURANCE",
  BONUS_PENSION_INSURANCE: "BONUS_PENSION_INSURANCE",
  BONUS_UNEMPLOYMENT_INSURANCE: "BONUS_UNEMPLOYMENT_INSURANCE",
  BONUS_LONG_TERM_CARE_INSURANCE: "BONUS_LONG_TERM_CARE_INSURANCE",

  REIMBURSEMENTS: "REIMBURSEMENTS",
  DISBURSEMENTS: "DISBURSEMENTS",
} as const;

export const ACCOUNTING_PERIOD_SCHEMA = (initialValues: unknown) =>
  z
    .string(m.must_be_provided())
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, m.must_be_provided())
    .refine(
      (period: string) => {
        if (!period) return true;

        const currentYearMonth = getCurrentYearMonth();

        return period <= currentYearMonth;
      },
      {
        error: () => m.must_not_be_in_future(),
      },
    )
    .refine(
      async (period: string) => {
        if (!period) return true;

        const initial = initialValues as { accountingPeriod: string };
        const initialPeriod = initial?.accountingPeriod;

        if (initialPeriod === period) return true;

        const response = await queryClient.fetchQuery(
          payrollQueries.existsPeriod(period as YearMonth),
        );
        const existsAlready = response;
        return !existsAlready;
      },
      {
        error: (t) => {
          if (typeof t.input !== "string") return;
          return m.period_exists_already({
            period: yearMonthFormatter.formatShort(t.input) ?? "",
          });
        },
      },
    );

const payoutMessage = m.must_be_at_least({
  value: currencyFormatter.formatFractionDigits(0.01),
});

export const FORM_SCHEMA = (initialValues: unknown) =>
  z.object({
    accountingPeriod: ACCOUNTING_PERIOD_SCHEMA(initialValues),
    payout: z.coerce.number(payoutMessage).min(0.01, payoutMessage),
    baseSalary: z.coerce.number().optional(),
    baseIncomeTax: z.coerce.number().optional(),
    baseChurchTax: z.coerce.number().optional(),
    baseSolidaritySurcharge: z.coerce.number().optional(),
    baseHealthInsurance: z.coerce.number().optional(),
    basePensionInsurance: z.coerce.number().optional(),
    baseUnemploymentInsurance: z.coerce.number().optional(),
    baseLongTermCareInsurance: z.coerce.number().optional(),
    bonusSalary: z.coerce.number().optional(),
    bonusIncomeTax: z.coerce.number().optional(),
    bonusChurchTax: z.coerce.number().optional(),
    bonusSolidaritySurcharge: z.coerce.number().optional(),
    bonusHealthInsurance: z.coerce.number().optional(),
    bonusPensionInsurance: z.coerce.number().optional(),
    bonusUnemploymentInsurance: z.coerce.number().optional(),
    bonusLongTermCareInsurance: z.coerce.number().optional(),
    reimbursements: z.coerce.number().optional(),
    disbursements: z.coerce.number().optional(),
  });
