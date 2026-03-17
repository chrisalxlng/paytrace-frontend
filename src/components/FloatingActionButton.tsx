import { Link, type LinkComponentProps } from "@tanstack/react-router";
import classNames from "classnames";
import type { ReactNode } from "react";

type FloatingActionButtonProps = LinkComponentProps<"a"> & {
  icon: ReactNode;
};

export const FloatingActionButton = ({
  icon,
  className,
  ...props
}: FloatingActionButtonProps) => {
  return (
    <Link
      className={classNames(
        "fixed bottom-5 right-5 z-99",
        "bg-primary text-on-primary",
        "p-4 rounded-full",
        "shadow-2xl cursor-pointer",
        "hover:bg-primary-darker active:bg-primary-darkest",
        className,
      )}
      {...props}
    >
      {icon}
    </Link>
  );
};
