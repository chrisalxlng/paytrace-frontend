import { defaultsDeep, isNil } from "lodash-es";
import type { StatChart } from "../../shared/types/charts";
import { ENTRY_TYPE } from "./constants";
import type {
  CreateRequest,
  Entry,
  EntryType,
  FormValues,
  MultipleQueryRequest,
  QueryResponse,
  StatsRequest,
  UpdateRequest,
} from "./types";

export const getStatsPayload = (charts: StatChart[]): StatsRequest[] =>
  charts.map((chart) =>
    chart.interval === "MONTHLY"
      ? {
          metric: chart.metric,
          interval: chart.interval,
          startYearMonth: chart.startYearMonth,
          endYearMonth: chart.endYearMonth,
        }
      : {
          metric: chart.metric,
          interval: chart.interval,
          startYear: chart.startYear,
          endYear: chart.endYear,
        },
  );

export const getMultipleQueryPayload = (): MultipleQueryRequest => ({
  limit: 5,
});

const findEntryByType = (
  entries: Entry[],
  entryType: keyof typeof ENTRY_TYPE,
) => entries.find((entry) => entry.type === entryType);

export const toFormValues = (response: QueryResponse): FormValues => ({
  accountingPeriod: response.accountingPeriod,
  payout: response.payout,
  baseSalary: findEntryByType(response.entries, ENTRY_TYPE.BASE_SALARY)?.amount,
  baseIncomeTax: findEntryByType(response.entries, ENTRY_TYPE.BASE_INCOME_TAX)
    ?.amount,
  baseChurchTax: findEntryByType(response.entries, ENTRY_TYPE.BASE_CHURCH_TAX)
    ?.amount,
  baseSolidaritySurcharge: findEntryByType(
    response.entries,
    ENTRY_TYPE.BASE_SOLIDARITY_SURCHARGE,
  )?.amount,
  baseHealthInsurance: findEntryByType(
    response.entries,
    ENTRY_TYPE.BASE_HEALTH_INSURANCE,
  )?.amount,
  basePensionInsurance: findEntryByType(
    response.entries,
    ENTRY_TYPE.BASE_PENSION_INSURANCE,
  )?.amount,
  baseUnemploymentInsurance: findEntryByType(
    response.entries,
    ENTRY_TYPE.BASE_UNEMPLOYMENT_INSURANCE,
  )?.amount,
  baseLongTermCareInsurance: findEntryByType(
    response.entries,
    ENTRY_TYPE.BASE_LONG_TERM_CARE_INSURANCE,
  )?.amount,
  bonusSalary: findEntryByType(response.entries, ENTRY_TYPE.BONUS_SALARY)
    ?.amount,
  bonusIncomeTax: findEntryByType(response.entries, ENTRY_TYPE.BONUS_INCOME_TAX)
    ?.amount,
  bonusChurchTax: findEntryByType(response.entries, ENTRY_TYPE.BONUS_CHURCH_TAX)
    ?.amount,
  bonusSolidaritySurcharge: findEntryByType(
    response.entries,
    ENTRY_TYPE.BONUS_SOLIDARITY_SURCHARGE,
  )?.amount,
  bonusHealthInsurance: findEntryByType(
    response.entries,
    ENTRY_TYPE.BONUS_HEALTH_INSURANCE,
  )?.amount,
  bonusPensionInsurance: findEntryByType(
    response.entries,
    ENTRY_TYPE.BONUS_PENSION_INSURANCE,
  )?.amount,
  bonusUnemploymentInsurance: findEntryByType(
    response.entries,
    ENTRY_TYPE.BONUS_UNEMPLOYMENT_INSURANCE,
  )?.amount,
  bonusLongTermCareInsurance: findEntryByType(
    response.entries,
    ENTRY_TYPE.BONUS_LONG_TERM_CARE_INSURANCE,
  )?.amount,
  reimbursements: findEntryByType(response.entries, ENTRY_TYPE.REIMBURSEMENTS)
    ?.amount,
  disbursements: findEntryByType(response.entries, ENTRY_TYPE.DISBURSEMENTS)
    ?.amount,
});

const buildEntries = (formValues: FormValues) => {
  const buildEntry = (type: EntryType, amount: number | undefined) => {
    if (isNil(amount)) {
      return [];
    }
    return [
      {
        type,
        amount: amount ?? 0,
      },
    ];
  };

  const entries: Entry[] = [
    ...buildEntry(ENTRY_TYPE.BASE_SALARY, formValues.baseSalary),
    ...buildEntry(ENTRY_TYPE.BASE_CHURCH_TAX, formValues.baseChurchTax),
    ...buildEntry(ENTRY_TYPE.BASE_INCOME_TAX, formValues.baseIncomeTax),
    ...buildEntry(
      ENTRY_TYPE.BASE_SOLIDARITY_SURCHARGE,
      formValues.baseSolidaritySurcharge,
    ),
    ...buildEntry(
      ENTRY_TYPE.BASE_HEALTH_INSURANCE,
      formValues.baseHealthInsurance,
    ),
    ...buildEntry(
      ENTRY_TYPE.BASE_PENSION_INSURANCE,
      formValues.basePensionInsurance,
    ),
    ...buildEntry(
      ENTRY_TYPE.BASE_UNEMPLOYMENT_INSURANCE,
      formValues.baseUnemploymentInsurance,
    ),
    ...buildEntry(
      ENTRY_TYPE.BASE_LONG_TERM_CARE_INSURANCE,
      formValues.baseLongTermCareInsurance,
    ),
    ...buildEntry(ENTRY_TYPE.BONUS_SALARY, formValues.bonusSalary),
    ...buildEntry(ENTRY_TYPE.BONUS_CHURCH_TAX, formValues.bonusChurchTax),
    ...buildEntry(ENTRY_TYPE.BONUS_INCOME_TAX, formValues.bonusIncomeTax),
    ...buildEntry(
      ENTRY_TYPE.BONUS_SOLIDARITY_SURCHARGE,
      formValues.bonusSolidaritySurcharge,
    ),
    ...buildEntry(
      ENTRY_TYPE.BONUS_HEALTH_INSURANCE,
      formValues.bonusHealthInsurance,
    ),
    ...buildEntry(
      ENTRY_TYPE.BONUS_PENSION_INSURANCE,
      formValues.bonusPensionInsurance,
    ),
    ...buildEntry(
      ENTRY_TYPE.BONUS_UNEMPLOYMENT_INSURANCE,
      formValues.bonusUnemploymentInsurance,
    ),
    ...buildEntry(
      ENTRY_TYPE.BONUS_LONG_TERM_CARE_INSURANCE,
      formValues.bonusLongTermCareInsurance,
    ),
    ...buildEntry(ENTRY_TYPE.REIMBURSEMENTS, formValues.reimbursements),
    ...buildEntry(ENTRY_TYPE.DISBURSEMENTS, formValues.disbursements),
  ];

  return entries;
};

export const toCreateRequest = (formValues: FormValues): CreateRequest => {
  const { accountingPeriod, payout } = formValues;

  const entries = buildEntries(formValues);

  return {
    accountingPeriod,
    payout,
    entries,
  };
};

export const toUpdateRequest = (
  payrollId: string,
  formValues: FormValues,
): UpdateRequest => {
  const { payout } = formValues;

  const entries = buildEntries(formValues);

  return {
    payrollId,
    payout,
    entries,
  };
};

export const checkConsistency = (values: FormValues): boolean => {
  const getAmountInCent = (value: number | undefined) =>
    Math.round((value ?? 0) * 100);

  const incomeValues = [
    getAmountInCent(values.baseSalary),
    getAmountInCent(values.bonusSalary),
    getAmountInCent(values.reimbursements),
  ];

  const deductionValues = [
    getAmountInCent(values.baseChurchTax),
    getAmountInCent(values.baseHealthInsurance),
    getAmountInCent(values.baseIncomeTax),
    getAmountInCent(values.baseLongTermCareInsurance),
    getAmountInCent(values.basePensionInsurance),
    getAmountInCent(values.baseSolidaritySurcharge),
    getAmountInCent(values.baseUnemploymentInsurance),
    getAmountInCent(values.bonusChurchTax),
    getAmountInCent(values.bonusHealthInsurance),
    getAmountInCent(values.bonusIncomeTax),
    getAmountInCent(values.bonusLongTermCareInsurance),
    getAmountInCent(values.bonusPensionInsurance),
    getAmountInCent(values.bonusSolidaritySurcharge),
    getAmountInCent(values.bonusUnemploymentInsurance),
    getAmountInCent(values.disbursements),
  ];

  const incomeCent = incomeValues.reduce((sum, current) => sum + current, 0);
  const deductionsCent = deductionValues.reduce(
    (sum, current) => sum + current,
    0,
  );

  const diffCent = incomeCent - deductionsCent;
  const payoutCent = getAmountInCent(values.payout);

  return diffCent === payoutCent;
};

export const getFormValues = (initialValues?: Partial<FormValues>) =>
  defaultsDeep(initialValues, {
    payout: 0,
    baseSalary: 0,
    baseChurchTax: 0,
    baseHealthInsurance: 0,
    baseIncomeTax: 0,
    baseLongTermCareInsurance: 0,
    basePensionInsurance: 0,
    baseSolidaritySurcharge: 0,
    baseUnemploymentInsurance: 0,
    bonusSalary: 0,
    bonusChurchTax: 0,
    bonusHealthInsurance: 0,
    bonusIncomeTax: 0,
    bonusLongTermCareInsurance: 0,
    bonusPensionInsurance: 0,
    bonusSolidaritySurcharge: 0,
    bonusUnemploymentInsurance: 0,
    reimbursements: 0,
    disbursements: 0,
  } satisfies Partial<FormValues>);
