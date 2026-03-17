import classNames from "classnames";
import { m } from "../paraglide/messages";
import { BULLET } from "../shared/constants/characters";
import { fileSizeFormatter } from "../shared/utils/formatters";
import type { UploadQueueItem } from "../stores/UploadStore";
import { Text } from "./Text";

type FileUploadCardProps = {
  queueItem: UploadQueueItem;
};

export const FileUploadCard = ({
  queueItem: { file, status, errorCode },
}: FileUploadCardProps) => {
  const buildMessage = () => {
    if (status === "pending") return m.pending();
    if (status === "loading") return m.uploading();
    if (status === "success") return m.finished();
    if (errorCode === "DUPLICATE_ACCOUNTING_PERIOD")
      return m.duplicate_accounting_period();
    if (errorCode === "UNSUPPORTED_PROVIDER") return m.provider_not_supported();
    if (errorCode === "PAYROLL_PARSING_FAILED") return m.file_reading_failed();
    return m.error();
  };

  return (
    <div className="bg-surface rounded-md p-4 flex flex-col gap-2">
      <Text>{file.name}</Text>
      <div className="flex gap-1 items-center">
        <Text
          variant="caption"
          className={classNames({
            "text-green": status === "success",
            "text-red": status === "error",
            "text-subtle": status !== "success" && status !== "error",
          })}
        >
          {buildMessage()}
        </Text>
        <Text variant="caption" color="subtle">
          {`${BULLET} ${fileSizeFormatter.format(file.size)}`}
        </Text>
      </div>
    </div>
  );
};
