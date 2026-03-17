import classNames from "classnames";
import type { ComponentPropsWithoutRef } from "react";

type CardProps = ComponentPropsWithoutRef<"div">;

export const Card = ({ children, className, ...props }: CardProps) => (
  <div
    className={classNames("bg-surface rounded-lg p-4", className)}
    {...props}
  >
    {children}
  </div>
);
