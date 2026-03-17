import { Toast, type ToastObject } from "@base-ui/react";
import {
  RiCheckboxCircleLine,
  RiCloseLine,
  RiErrorWarningLine,
} from "@remixicon/react";
import classNames from "classnames";
import { IconButton } from "./IconButton";
import { IconContainer } from "./IconContainer";
import { Text } from "./Text";

export type ToastsData = {
  variant: "success" | "error";
};

export const Toasts = () => {
  const { toasts } = Toast.useToastManager<ToastsData>();

  const buildVariantIndicator = (toast: ToastObject<ToastsData>) => {
    const { data } = toast;
    const { variant } = data ?? {};

    if (variant === "success") {
      return (
        <IconContainer color="green">
          <RiCheckboxCircleLine />
        </IconContainer>
      );
    } else if (variant === "error") {
      return (
        <IconContainer color="red">
          <RiErrorWarningLine />
        </IconContainer>
      );
    }
  };

  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col gap-3 p-4 pointer-events-none">
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            toast={toast}
            className={classNames(
              "pointer-events-auto",
              "[--gap:0.75rem] [--peek:0.75rem]",
              "[--scale:calc(max(0,1-(var(--toast-index)*0.1)))]",
              "[--shrink:calc(1-var(--scale))]",
              "[--height:var(--toast-frontmost-height,var(--toast-height))]",
              "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
              "relative z-[calc(1000-var(--toast-index))]",
              "origin-bottom border-none",
              "transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))]",
              "rounded-lg border border-gray-200 bg-gray-50 bg-clip-padding p-4",
              "shadow-lg select-none after:absolute after:top-full after:left-0",
              "after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
              "data-ending-style:opacity-0",
              "data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))]",
              "data-limited:opacity-0 data-starting-style:transform-[translateY(150%)]",
              "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]",
              "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
              "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
              "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
              "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
              "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
              "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
              "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
              "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))] h-(--height)",
              "data-expanded:h-(--toast-height) [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]",
            )}
          >
            <Toast.Content
              className={classNames(
                "w-75 bg-overlay rounded-md shadow-2xl p-2",
                "flex justify-between gap-2 z-99 border-2 border-subtle",
                "overflow-hidden transition-opacity duration-250",
                "data-behind:pointer-events-none data-behind:opacity-0",
                "data-expanded:pointer-events-auto data-expanded:opacity-100",
              )}
            >
              <div className="flex gap-1 items-center">
                {buildVariantIndicator(toast)}
                <div className="flex flex-col gap-2 justify-center">
                  <Toast.Title
                    render={(props) => <Text>{props.children}</Text>}
                  />
                  <Toast.Description
                    render={(props) => (
                      <Text color="subtle">{props.children}</Text>
                    )}
                  />
                </div>
              </div>
              <Toast.Close
                aria-label="Schließen"
                render={
                  <IconButton>
                    <RiCloseLine />
                  </IconButton>
                }
              />
            </Toast.Content>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
};
