import { isNil } from "lodash-es";
import type { Nillable } from "../types/common";

export const noFractionDigitsCurrencyFormatter = new Intl.NumberFormat(
  window.navigator.language,
  {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
);

export const fractionDigitsCurrencyFormatter = new Intl.NumberFormat(
  window.navigator.language,
  {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
);

export const currencyFormatter = {
  format: (number: number) => noFractionDigitsCurrencyFormatter.format(number),
  formatFractionDigits: (number: number) =>
    fractionDigitsCurrencyFormatter.format(number),
};

export const signPercentageFormatter = new Intl.NumberFormat(
  window.navigator.language,
  {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  },
);

export const noSignPercentageFormatter = new Intl.NumberFormat(
  window.navigator.language,
  {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: "never",
  },
);

export const percentageFormatter = {
  format: signPercentageFormatter.format,
  formatWithoutSign: noSignPercentageFormatter.format,
};

export const yearFormatter = {
  formatRange: (start: Nillable<string>, end: Nillable<string>) => {
    if (isNil(start) && isNil(end)) return null;
    if (isNil(start)) return end;
    if (isNil(end)) return start;
    return `${start} \u2013 ${end}`;
  },
};

const longYearMonthFormatter = new Intl.DateTimeFormat(
  window.navigator.language,
  {
    month: "long",
    year: "numeric",
  },
);

const shortYearMonthFormatter = new Intl.DateTimeFormat(
  window.navigator.language,
  {
    month: "short",
    year: "numeric",
  },
);

const formatMonthYear = (
  formatter: Intl.DateTimeFormat,
  yearMonth: Nillable<string>,
) => {
  if (isNil(yearMonth)) return null;
  return formatter.format(new Date(yearMonth));
};

const formatRange = (
  formatter: Intl.DateTimeFormat,
  startYearMonth: Nillable<string>,
  endYearMonth: Nillable<string>,
) => {
  if (isNil(startYearMonth) && isNil(endYearMonth)) return null;
  if (isNil(startYearMonth)) return formatMonthYear(formatter, endYearMonth);
  if (isNil(endYearMonth)) return formatMonthYear(formatter, startYearMonth);
  return formatter.formatRange(
    new Date(startYearMonth),
    new Date(endYearMonth),
  );
};

export const yearMonthFormatter = {
  format: (yearMonth: Nillable<string>) =>
    formatMonthYear(longYearMonthFormatter, yearMonth),
  formatShort: (yearMonth: Nillable<string>) =>
    formatMonthYear(shortYearMonthFormatter, yearMonth),
  formatRange: (
    startYearMonth: Nillable<string>,
    endYearMonth: Nillable<string>,
  ) => formatRange(longYearMonthFormatter, startYearMonth, endYearMonth),
  formatRangeShort: (
    startYearMonth: Nillable<string>,
    endYearMonth: Nillable<string>,
  ) => formatRange(shortYearMonthFormatter, startYearMonth, endYearMonth),
};

export const fileSizeFormatter = {
  format: (bytes: number) => {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const formattedValue = Math.round(bytes / k ** i);

    return `${formattedValue} ${sizes.at(i)}`;
  },
};
