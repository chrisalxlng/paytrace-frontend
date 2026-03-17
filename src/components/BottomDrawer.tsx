import { Drawer, ScrollArea } from "@base-ui/react";
import { RiCloseFill } from "@remixicon/react";
import classNames from "classnames";
import type { PropsWithChildren, ReactElement } from "react";
import { IconButton } from "./IconButton";

type BottomDrawerProps = PropsWithChildren &
  Drawer.Root.Props & {
    triggerSlot: ReactElement;
    titleSlot?: ReactElement;
    descriptionSlot?: ReactElement;
  };

export const BottomDrawer = ({
  children,
  triggerSlot,
  titleSlot,
  descriptionSlot,
  ...props
}: BottomDrawerProps) => (
  <Drawer.Root {...props}>
    <Drawer.Trigger className="cursor-pointer" render={triggerSlot} />
    <Drawer.Portal>
      <Drawer.Backdrop
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
      <Drawer.Viewport className="group fixed inset-0">
        <ScrollArea.Root
          style={{ position: undefined }}
          className={classNames(
            "h-full overscroll-contain transition-[transform,translate] duration-600",
            "ease-[cubic-bezier(0.45,1.005,0,1.005)] group-data-starting-style:translate-y-[100dvh]",
            "group-data-ending-style:pointer-events-none",
          )}
        >
          <ScrollArea.Viewport className="h-full overscroll-contain touch-auto">
            <div className="flex min-h-full items-end justify-center pt-8 md:py-16 md:px-16 min-w-0">
              <Drawer.Popup
                className={classNames(
                  "group w-full max-w-lg outline-none transition-transform duration800",
                  "ease-[cubic-bezier(0.45,1.005,0,1.005)] transform-[translateY(var(--drawer-swipe-movement-y))]",
                  "data-swiping:select-none data-ending-style:transform-[translateY(calc(max(100dvh,100%)+2px))]",
                  "data-ending-style:duration-350 data-ending-style:ease-[cubic-bezier(0.375,0.015,0.545,0.455)]",
                )}
              >
                <div
                  className={classNames(
                    "relative flex flex-col rounded-t-2xl bg-overlay/80 backdrop-blur-3xl px-6 pt-4 pb-6",
                    "shadow-[0_0_0_1px_oklch(29%_0.75%_264deg/80%)] transition-shadow",
                    "duration-350 ease-[cubic-bezier(0.375,0.015,0.545,0.455)]",
                    "group-data-ending-style:shadow-[0_0_0_1px_rgb(0_0_0/0%)] md:rounded-xl",
                    "border-2 border-subtle",
                  )}
                >
                  <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center">
                    <div aria-hidden className="h-9 w-9" />
                    <div className="h-0.75 w-12 justify-self-center rounded-full bg-subtle" />
                    <div className="justify-self-end ">
                      <Drawer.Close
                        aria-label="Menü schließen"
                        render={
                          <IconButton>
                            <RiCloseFill />
                          </IconButton>
                        }
                      />
                    </div>
                  </div>

                  <Drawer.Content className="w-full flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <Drawer.Title render={titleSlot} />
                      <Drawer.Description render={descriptionSlot} />
                    </div>
                    {children}
                  </Drawer.Content>
                </div>
              </Drawer.Popup>
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className={classNames(
              "pointer-events-none absolute m-[0.4rem] flex w-1 justify-center",
              "rounded-2xl opacity-0 transition-opacity duration-250ms",
              "data-scrolling:pointer-events-auto data-scrolling:opacity-100",
              "data-scrolling:duration-75 data-scrolling:delay-[0ms]",
              "hover:pointer-events-auto hover:opacity-100 hover:duration-75",
              "hover:delay-[0ms] md:w-1.75 data-ending-style:opacity-0 data-ending-style:duration-250",
            )}
          >
            <ScrollArea.Thumb
              className={classNames(
                "w-full rounded-[inherit] bg-subtle before:absolute before:content-['']",
                "before:top-1/2 before:left-1/2 before:h-[calc(100%+1rem)] before:w-[calc(100%+1rem)]",
                "before:-translate-x-1/2 before:-translate-y-1/2",
              )}
            />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
);
