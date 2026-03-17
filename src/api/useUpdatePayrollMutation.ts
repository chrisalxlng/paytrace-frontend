import {
  type MutationFunctionContext,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Payroll } from "../models";
import type { ErrorResponse } from "../shared/types/api";
import { apiClient } from "./apiClient";
import { PAYROLL_BASE_PATH } from "./constants";
import { PAYROLL_QUERY_KEY } from "./payroll.queries";

const update = (request: Payroll.UpdateRequest): Promise<void> =>
  apiClient.post(`${PAYROLL_BASE_PATH}/update`, request);

export const useUpdatePayrollMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<
  void,
  AxiosError<ErrorResponse<Payroll.BaseMutationErrorCode>>,
  Payroll.UpdateRequest,
  unknown
>) => {
  const queryClient = useQueryClient();

  const handleSuccess = async (
    // biome-ignore lint/suspicious/noConfusingVoidType: `void` is used by TanStack Query
    data: void,
    variables: Payroll.UpdateRequest,
    onMutateResult: unknown,
    context: MutationFunctionContext,
  ) => {
    await queryClient.invalidateQueries({ queryKey: PAYROLL_QUERY_KEY });

    if (onSuccess) {
      await onSuccess(data, variables, onMutateResult, context);
    }
  };

  return useMutation({
    mutationFn: update,
    onSuccess: handleSuccess,
    ...options,
  });
};
