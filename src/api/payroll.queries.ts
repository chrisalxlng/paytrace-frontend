import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { Payroll } from "../models";
import type { Year, YearMonth } from "../shared/types/common";
import { buildSearchParams } from "../shared/utils/common";
import { apiClient } from "./apiClient";
import { PAYROLL_BASE_PATH } from "./constants";

export const PAYROLL_QUERY_KEY = ["payroll"];

const fetchById = async (payrollId: string): Promise<Payroll.QueryResponse> => {
  const response = await apiClient.get(`${PAYROLL_BASE_PATH}/${payrollId}`);
  return response.data;
};

const fetchMultiple = async (
  request?: Payroll.MultipleQueryRequest,
): Promise<Payroll.MultipleQueryResponse> => {
  const response = await apiClient.get(
    `${PAYROLL_BASE_PATH}?${buildSearchParams(request)}`,
  );
  return response.data;
};

const fetchHasInconsistent = async (): Promise<boolean> => {
  const response = await apiClient.get(`${PAYROLL_BASE_PATH}/has-inconsistent`);
  return response.data;
};

const fetchExistsPeriod = async (
  accountingPeriod: YearMonth,
): Promise<boolean> => {
  const response = await apiClient.get(
    `${PAYROLL_BASE_PATH}/exists-period?${buildSearchParams({ accountingPeriod })}`,
  );
  return response.data;
};

const fetchStats = async (
  request: Payroll.StatsRequest[],
): Promise<Payroll.StatsResponse[]> => {
  const response = await apiClient.post(`${PAYROLL_BASE_PATH}/stats`, request);
  return response.data;
};

export const payrollQueries = {
  getMultiple: (args?: Payroll.MultipleQueryRequest) =>
    infiniteQueryOptions({
      queryKey: [...PAYROLL_QUERY_KEY, "list", args],
      queryFn: ({ pageParam }) => fetchMultiple({ ...args, cursor: pageParam }),
      initialPageParam: undefined as Year | undefined,
      getNextPageParam: ({ nextCursor }) => nextCursor,
    }),

  getById: (id: string) =>
    queryOptions({
      queryKey: [...PAYROLL_QUERY_KEY, "detail", id],
      queryFn: () => fetchById(id),
    }),

  hasInconsistent: () =>
    queryOptions({
      queryKey: [...PAYROLL_QUERY_KEY, "inconsistent"],
      queryFn: fetchHasInconsistent,
    }),

  existsPeriod: (period: YearMonth) =>
    queryOptions({
      queryKey: [...PAYROLL_QUERY_KEY, "period"],
      queryFn: () => fetchExistsPeriod(period),
    }),

  stats: (args: Payroll.StatsRequest[]) =>
    queryOptions({
      queryKey: [...PAYROLL_QUERY_KEY, "stats"],
      queryFn: () => fetchStats(args),
      staleTime: 1000 * 60 * 5,
    }),
};
