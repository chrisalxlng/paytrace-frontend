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

const upload = (request: Payroll.UploadRequest): Promise<void> => {
  const formData = new FormData();
  formData.append("file", request.file);

  return apiClient.post(`${PAYROLL_BASE_PATH}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const useUploadPayrollMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<
  void,
  AxiosError<ErrorResponse<Payroll.UploadResponseErrorCode>>,
  Payroll.UploadRequest,
  unknown
>) => {
  const queryClient = useQueryClient();

  const handleSuccess = async (
    // biome-ignore lint/suspicious/noConfusingVoidType: `void` is used by TanStack Query
    data: void,
    variables: Payroll.UploadRequest,
    onMutateResult: unknown,
    context: MutationFunctionContext,
  ) => {
    await queryClient.invalidateQueries({ queryKey: PAYROLL_QUERY_KEY });

    if (onSuccess) {
      await onSuccess(data, variables, onMutateResult, context);
    }
  };

  return useMutation({
    mutationFn: upload,
    onSuccess: handleSuccess,
    ...options,
  });
};
