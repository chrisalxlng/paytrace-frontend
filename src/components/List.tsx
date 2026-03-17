import classNames from "classnames";
import type { PropsWithChildren } from "react";

type ListProps = PropsWithChildren & {
  className?: string;
};

export const List = ({ children, className }: ListProps) => (
  <ul
    className={classNames("bg-surface rounded-lg overflow-hidden", className)}
  >
    {children}
  </ul>
);
