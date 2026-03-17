import classNames from "classnames";
import type { PropsWithChildren } from "react";
import { useDropzone } from "react-dropzone";

type DropzoneProps = PropsWithChildren & {
  onDrop?: (files: File[]) => void;
};

export const Dropzone = ({ children, onDrop }: DropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        <div
          className={classNames(
            "p-14 flex justify-center items-center",
            "border-2 border-dashed rounded-md",
            "cursor-pointer hover:border-primary",
            {
              "border-subtle": !isDragActive,
              "border-primary": isDragActive,
            },
          )}
        >
          {children}
        </div>
      }
    </div>
  );
};
