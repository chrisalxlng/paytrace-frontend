import { isNil } from "lodash-es";
import type { Nillable, Year, YearMonth } from "../types/common";

const parseYearMonth = (ym: YearMonth): Date => {
  const [year, month] = ym.split("-").map(Number);
  return new Date(year, month - 1, 1);
};

const formatToYearMonth = (date: Date): YearMonth => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}` as YearMonth;
};

export const getPreviousYearMonth = (): YearMonth => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return formatToYearMonth(date);
};

export const getCurrentYearMonth = (): YearMonth => {
  const date = new Date();
  date.setMonth(date.getMonth());
  return formatToYearMonth(date);
};

export const getYearMonthOffset = (
  start: YearMonth,
  offsetMonths: number,
): YearMonth => {
  const date = parseYearMonth(start);
  date.setMonth(date.getMonth() - offsetMonths);
  return formatToYearMonth(date);
};

const formatToYear = (date: Date): Year => {
  return date.getFullYear().toString() as Year;
};

export const getPreviousYear = (): Year => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return formatToYear(date);
};

export const getYearOffset = (start: Year, offsetYears: number): Year => {
  const date = new Date(Number(start), 0, 1);
  date.setFullYear(date.getFullYear() - offsetYears);
  return formatToYear(date);
};

export const buildSearchParams = (
  ...params: Nillable<Record<string, unknown>>[]
): URLSearchParams => {
  const searchParams = new URLSearchParams();

  for (const obj of params) {
    if (!obj) continue;

    Object.entries(obj).forEach(([key, value]) => {
      if (!isNil(value)) {
        searchParams.set(key, String(value));
      }
    });
  }

  return searchParams;
};
