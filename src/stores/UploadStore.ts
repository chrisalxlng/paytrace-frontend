import { uniqueId } from "lodash-es";
import { create } from "zustand";
import type { Payroll } from "../models";
import type {
  Nullable,
  StrictExclude,
  StrictExtract,
} from "../shared/types/common";

type UploadStatus = "pending" | "loading" | "success" | "error";

export type UploadQueueItem = {
  fileId: string;
  file: File;
  addedAt: string;
} & (
  | {
      status: StrictExtract<UploadStatus, "error">;
      errorCode: Nullable<Payroll.UploadResponseErrorCode>;
    }
  | {
      status: StrictExclude<UploadStatus, "error">;
      errorCode?: never;
    }
);

type UploadState = {
  queue: UploadQueueItem[];
  addFiles: (files: File[]) => void;
  startUpload: (fileId: string) => void;
  markAsSuccess: (fileId: string) => void;
  markAsError: (
    fileId: string,
    errorCode: Nullable<Payroll.UploadResponseErrorCode>,
  ) => void;
};

export const useUploadStore = create<UploadState>((set) => ({
  queue: [],
  addFiles: (files) =>
    set((state) => ({
      queue: [
        ...state.queue,
        ...files.map((file) => ({
          fileId: uniqueId(),
          file,
          status: "pending" as StrictExtract<UploadStatus, "pending">,
          addedAt: new Date().toUTCString(),
        })),
      ],
    })),
  startUpload: (fileId) =>
    set((state) => ({
      queue: state.queue.map((item) => {
        if (item.fileId !== fileId) return item;

        return {
          ...item,
          status: "loading",
          errorCode: undefined,
        };
      }),
    })),
  markAsSuccess: (fileId) =>
    set((state) => ({
      queue: state.queue.map((item) => {
        if (item.fileId !== fileId) return item;

        return {
          ...item,
          status: "success",
          errorCode: undefined,
        };
      }),
    })),
  markAsError: (fileId, errorCode) =>
    set((state) => ({
      queue: state.queue.map((item) => {
        if (item.fileId !== fileId) return item;

        return {
          ...item,
          status: "error",
          errorCode,
        };
      }),
    })),
}));
