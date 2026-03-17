import { useRef, useState } from "react";

export const useConfirm = () => {
  const [open, setOpen] = useState(false);

  const resolveRef = useRef<(value: boolean) => void>(null);

  const confirm = async () => {
    setOpen(true);

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    resolveRef.current?.(true);
    setOpen(false);
  };

  const handleCancel = () => {
    resolveRef.current?.(false);
    setOpen(false);
  };

  return {
    open,
    confirm,
    handleConfirm,
    handleCancel,
  };
};
