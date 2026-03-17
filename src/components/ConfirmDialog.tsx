import { AlertDialog, type AlertDialogRootProps } from "@base-ui/react";
import classNames from "classnames";
import type { ReactElement } from "react";

type ConfirmDialogProps = AlertDialogRootProps & {
  triggerSlot?: ReactElement;
  titleSlot?: ReactElement;
  descriptionSlot?: ReactElement;
  confirmSlot?: ReactElement;
  cancelSlot?: ReactElement;
};

export const ConfirmDialog = ({
  triggerSlot,
  titleSlot,
  descriptionSlot,
  confirmSlot,
  cancelSlot,
  ...props
}: ConfirmDialogProps) => {
  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Trigger render={triggerSlot} />
      <AlertDialog.Portal>
        <AlertDialog.Backdrop
          className={classNames(
            "[--backdrop-opacity:0.7] fixed inset-0 min-h-dvh",
            "bg-[linear-gradient(to_bottom,rgb(0_0_0/5%)_0,rgb(0_0_0/10%)_50%)]",
            "opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))]",
            "transition-[backdrop-filter,opacity] duration-600 ease-(--ease-out-fast)",
            "backdrop-blur-[1.5px] supports-[-webkit-touch-callout:none]:absolute",
            "data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:backdrop-blur-0",
            "data-ending-style:backdrop-blur-0 data-ending-style:duration-350",
            "data-ending-style:ease-[cubic-bezier(0.375,0.015,0.545,0.455)]",
          )}
        />
        <AlertDialog.Popup
          className={classNames(
            "fixed top-1/2 left-1/2 -mt-8 w-xl max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2",
            "rounded-lg bg-overlay/80 backdrop-blur-3xl p-6 text-gray-900 outline-1 outline-gray-200",
            "transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0",
            "data-starting-style:scale-90 data-starting-style:opacity-0",
            "flex flex-col gap-8 border-2 border-subtle",
          )}
        >
          <div className="flex flex-col gap-3">
            <AlertDialog.Title render={titleSlot} />
            <AlertDialog.Description render={descriptionSlot} />
          </div>
          <div className="flex justify-end gap-4">
            <AlertDialog.Close render={cancelSlot} />
            <AlertDialog.Close render={confirmSlot} />
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
