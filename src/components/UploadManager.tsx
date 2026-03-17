import { isNil } from "lodash-es";
import { useEffect } from "react";
import { useUploadPayrollMutation } from "../api/useUploadPayrollMutation";
import { useUploadStore } from "../stores/UploadStore";

export const UploadManager = () => {
  const { queue, startUpload, markAsSuccess, markAsError } = useUploadStore();
  const pendingItem = queue.find((item) => item.status === "pending");
  const isLoading = queue.some((item) => item.status === "loading");

  const { mutate: uploadPayroll } = useUploadPayrollMutation({
    onMutate: ({ fileId }) => {
      startUpload(fileId);
    },
    onSuccess: (_, { fileId }) => {
      markAsSuccess(fileId);
    },
    onError: ({ response }, { fileId }) => {
      const errorCode = response?.data.errorCode;
      markAsError(fileId, errorCode ?? null);
    },
  });

  useEffect(() => {
    if (isLoading) return;
    if (isNil(pendingItem)) return;

    uploadPayroll(pendingItem);
  }, [isLoading, pendingItem, uploadPayroll]);

  return null;
};
