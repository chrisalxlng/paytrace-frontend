import { Button, type ButtonProps } from "@base-ui/react";
import classNames from "classnames";

type IconButtonProps = ButtonProps;

export const IconButton = ({
  children,
  className,
  ...props
}: IconButtonProps) => (
  <Button
    className={classNames(
      "cursor-pointer text-subtle rounded-md p-1 hover:bg-subtle-darker active:bg-subtle-darkest",
      className,
    )}
    {...props}
  >
    {children}
  </Button>
);
